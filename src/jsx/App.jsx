import Inferno from 'inferno';
import Component from 'inferno-component';
import { knuthShuffle } from 'knuth-shuffle';
import store from 'store';
import expirePlugin from 'store/plugins/expire';
import Dashboard from './Dashboard.jsx';
import Player from './Player.jsx';
import api from './utilities/api.js';
import help from './utilities/helpers.js';
import '../scss/App.scss';

const STORE_POPULAR = 'popular';
const STORE_PLAYED = 'played';
const STORE_POPULAR_EXPIRY = help.daysFromNow(7);
const STORE_TAGS_EXPIRY = help.daysFromNow(7);
const STORE_PLAYED_LIMIT = 500; // TODO
const PLAYLISTS_LIMIT = 10;

export default class App extends Component {
  constructor() {
    super();

    store.addPlugin(expirePlugin);

    this.state = {
      currentTags: [],
      playlist: false,
      playlistLoading: false,
      track: false,
      topTags: store.get(STORE_POPULAR) || [],
      relatedTags: [],
    };

    this.played = store.get(STORE_PLAYED) || [];

    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.fetchPlaylists = this.fetchPlaylists.bind(this);
    this.fetchNextSong = this.fetchNextSong.bind(this);

    if (!this.state.topTags.length) this.fetchTopTags();
  }

  fetchTopTags() {
    api.explore({ page: 1, per_page: 30 }).then(res => {
      const tags = [...this.state.topTags, ...res.filters];
      this.setState({ topTags: tags });
      store.set(STORE_POPULAR, tags, STORE_POPULAR_EXPIRY);
    });
  }

  addTag(tag) {
    const oldTag = this.state.currentTags[0];
    const newTags = !oldTag || tag === oldTag ? [tag] : [tag, oldTag];
    this.setState({ currentTags: newTags });
    this.fetchPlaylists({ tags: newTags });
  }

  removeTag(tag) {
    const index = this.state.currentTags.indexOf(tag);
    this.state.currentTags.splice(index, 1);
    this.setState({ currentTags: this.state.currentTags });
    return this.state.currentTags;
  }

  mapPlaylists(playlists) {
    const mapPlaylist = playlist => {
      return {
        id: playlist.id,
        colors: playlist.color_palette,
        cover: playlist.cover_urls.sq500,
      };
    };

    if (playlists.constructor === Array) {
      return knuthShuffle(playlists).map(playlist => mapPlaylist(playlist));
    } else {
      return mapPlaylist(playlists);
    }
  }

  mapRelatedTags(tags) {
    return tags.map(tag => {
      return {
        name: tag.name,
        image: tag.artist_avatar,
      }
    });
  }

  validPlaylist(playlist) {
    if (playlist) {
      const alreadyPlayed = this.played.indexOf(playlist.id) >= 0;
      if (alreadyPlayed) this.fetchPlaylists();
      else return true;
    } else {
      const removableTags = this.state.currentTags.length > 1;
      if (removableTags) this.fetchPlaylists({ tags: this.removeTag(1) });
    }

    return false;
  }

  loadPlaylist(tagString, data) {
    const playlist = data.playlists[data.index];
    data.index++;
    store.set(tagString, data, STORE_TAGS_EXPIRY);
    if (!this.validPlaylist(playlist)) return false;
    this.setState({ playlist: playlist, relatedTags: data.related });
    this.fetchNextSong(playlist.id);
    this.played.push(playlist.id);
    store.set(STORE_PLAYED, this.played);
  }

  fetchPlaylists({ tags = this.state.currentTags } = {}) {
    const cleanTags = tags.concat().sort().map(tag => tag.toLowerCase());
    const tagString = cleanTags.toString();
    const data = store.get(tagString) || { page: 0, index: 0, playlists: [] };

    if (data.index < data.playlists.length) {
      this.loadPlaylist(tagString, data);
    } else {
      data.page += 1;
      data.index = 0;
      this.setState({ playlistLoading: true });

      api.playlists(cleanTags, {
        include: 'mixes+explore_filters',
        page: data.page,
        per_page: PLAYLISTS_LIMIT,
      }).then(res => {
        data.playlists = this.mapPlaylists(res.mix_set.mixes);
        data.related = this.mapRelatedTags(res.filters);
        this.loadPlaylist(tagString, data);
        this.setState({ playlistLoading: false });
      }, err => {
        console.dir(err);
      });
    }
  }

  fetchRelatedPlaylist(playlistId) {
    api.nextPlaylist({ mix_id: playlistId }).then(res => {
      const playlist = this.mapPlaylists(res.next_mix);
      this.setState({ playlist: playlist });
      this.fetchNextSong(playlist.id);
    });
  }

  fetchNextSong(playlistId) {
    playlistId = playlistId || this.state.playlist.id;

    api.nextSong({ mix_id: playlistId }).then(
      res => this.setState({ track: res.set.track }),
      err => this.fetchRelatedPlaylist(playlistId)
    );
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
        refresh={ this.fetchPlaylists }
        next={ this.fetchNextSong }
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
