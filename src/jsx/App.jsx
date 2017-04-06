import Inferno from 'inferno';
import Component from 'inferno-component';
import Dashboard from './Dashboard.jsx';
import Player from './Player.jsx';
import eight from './utilities/eighttracks.js';
import '../scss/App.scss';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      currentTags: [],
      playlist: false,
      track: false,
      topTags: [],
      relatedTags: [],
      artistTags: [],
    };

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
  }

  selectPlaylist(playlists) {
    if (!playlists.length) return false;
    return playlists[0];
  }

  fetchPlaylist({ tags = tags, page = 1, limit = 1 }) {
    const params = {
      include: 'mixes[artist_list[artist_avatar]]+explore_filters+pagination',
      page: page,
      per_page: limit,
    }

    eight.playlists(tags, params).then(json => {
      const playlist = this.selectPlaylist(json.mix_set.mixes);

      this.setState({
        playlist: playlist || this.state.playlist,
        relatedTags: json.filters ? json.filters : this.state.relatedTags,
        artistTags: playlist ? playlist.artist_list : this.state.artists,
      });

      if (!playlist && tags.length === 2) {
        this.removeTag(1);
        this.fetchPlaylist({ tags: tags });
      }
    })
  }

  fetchTopTags({ page = 1, limit = 30 } = {}) {
    eight.explore({ page: page, per_page: limit }).then(json => {
      this.setState({ topTags: [...this.state.topTags, ...json.filters] });
    });
  }

  renderDashboard() {
    const lists = [
      { name: 'Related', tags: this.state.relatedTags },
      { name: 'Popular', tags: this.state.topTags },
      { name: 'In This Playlist', tags: this.state.artistTags },
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
