import Inferno from 'inferno';
import Component from 'inferno-component';
import Dashboard from './Dashboard.jsx';
import Player from './Player.jsx';
import eight from './utilities/eighttracks.js';
import { knuthShuffle } from 'knuth-shuffle';
import '../scss/App.scss';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      currentTags: [],
      playlist: false,
      playlistLoading: false,
      track: false,
      topTags: [],
      relatedTags: [],
    };

    this.playlists = {};
    this.pages = {};
    this.indexes = {};
    this.played = [];

    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  componentDidMount() {
    this.fetchTopTags();
  }

  addTag(tag) {
    const oldTag = this.state.currentTags[0];
    const newTags = !oldTag || tag === oldTag ? [tag] : [tag, oldTag];
    this.setState({ currentTags: newTags });
    this.fetchPlaylist({ tags: newTags });
  }

  removeTag(tag) {
    const index = this.state.currentTags.indexOf(tag);
    this.state.currentTags.splice(index, 1);
    this.setState({ currentTags: this.state.currentTags });
    return this.state.currentTags;
  }

  selectPlaylist(tags) {
    if (!this.playlists[tags].length) return false;
    const playlist = this.playlists[tags][this.indexes[tags]];

    if (this.played.indexOf(playlist.id) >= 0) {
      this.fetchPlaylist({ tags: tags });
      return false;
    }

    this.played.push(playlist.id);
    return playlist;
  }

  fetchPlaylist({ tags = [], page = 1, limit = 10 }) {
    this.setState({ playlistLoading: true });
    tags = tags.concat().sort();

    if (this.playlists[tags] && this.playlists[tags].length && ++this.indexes[tags] < limit) {
      const playlist = this.selectPlaylist(tags);
      if (playlist) this.setState({ playlist: playlist });
    } else {
      this.indexes[tags] = 0;
      this.pages[tags] = this.pages[tags] ? this.pages[tags] + 1 : page;

      const params = {
        include: 'mixes+explore_filters+pagination',
        page: this.pages[tags],
        per_page: limit,
      }

      eight.playlists(tags, params).then(res => {
        this.playlists[tags] = knuthShuffle(res.mix_set.mixes);
        const playlist = this.selectPlaylist(tags);

        this.setState({
          playlist: playlist || this.state.playlist,
          relatedTags: res.filters ? res.filters : this.state.relatedTags,
          playlistLoading: false,
        });

        if (!playlist && tags.length === 2) {
          this.fetchPlaylist({ tags: this.removeTag(1) });
        }
      });
    }
  }

  fetchTopTags({ page = 1, limit = 30 } = {}) {
    eight.explore({ page: page, per_page: limit }).then(res => {
      this.setState({ topTags: [...this.state.topTags, ...res.filters] });
    });
  }

  renderDashboard() {
    const lists = [
      { name: 'Related', tags: this.state.relatedTags },
      { name: 'Popular', tags: this.state.topTags },
    ];

    return <Dashboard
      addTag={ this.addTag }
      removeTag={ this.removeTag }
      currentTags={ this.state.currentTags }
      lists={ lists }
    />;
  }

  renderPlayer() {
    if (this.state.playlist) {
      return <Player
        playlistLoading={ this.state.playlistLoading }
        currentTags={ this.state.currentTags }
        playlist={ this.state.playlist }
        track={ this.state.track }
      />;
    }
  }

  render() {
    return (
      <div className="App">
        { this.renderDashboard() }
        { this.renderPlayer() }
      </div>
    );
  }
}
