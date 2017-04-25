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

const STORE_TOP_ARTISTS = '___top_artists';
const STORE_TOP_TAGS = '___top_tags';
const STORE_PLAYED = '___played';

const STORE_TOP_ARTISTS_EXPIRY = help.daysFromNow(7);
const STORE_TOP_TAGS_EXPIRY = help.daysFromNow(7);
const STORE_TAGS_EXPIRY = help.daysFromNow(7);

const STORE_PLAYED_LIMIT = 2000;
const PLAYLISTS_PER_PAGE = 10;

const TAG_BLACKLIST = ['seen live'];

export default class App extends Component {
  constructor() {
    super();

    store.addPlugin(expirePlugin);

    this.state = {
      playerVisible: false,
      playlistLoading: true,
      trackLoading: true,
      currentTags: [],
      playlist: false,
      track: false,
      topArtists: store.get(STORE_TOP_ARTISTS) || [],
      topTags: store.get(STORE_TOP_TAGS) || [],
      related: [],
    };

    this.played = store.get(STORE_PLAYED) || [];
    this.skipAllowed = true;
    this.atLastTrack = false;

    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.fetchPlaylists = this.fetchPlaylists.bind(this);
    this.fetchNextSong = this.fetchNextSong.bind(this);
    this.getCoverSize = this.getCoverSize.bind(this);
  }

  componentDidMount() {
    if (!this.state.topArtists.length) this.fetchTopArtists();
  }

  fetchTopArtists() {
    api.topArtists().then(res => {
      const artists = this.mapTopArtists(res.artists.artist);
      this.setState({ topArtists: artists });
      store.set(STORE_TOP_ARTISTS, artists, STORE_TOP_ARTISTS_EXPIRY);
      if (!this.state.topTags.length) this.fetchTopTags();
    });
  }

  mapTopArtists(artists) {
    return artists.map(a => {
      return { name: a.name, image: a.image[2]['#text'] };
    });
  }

  fetchTopTags() {
    api.topTags().then(res => {
      const tags = this.mapTopTags(res.tags.tag);
      this.setState({ topTags: tags });
      store.set(STORE_TOP_TAGS, tags, STORE_TOP_TAGS_EXPIRY);
    });
  }

  mapTopTags(tags) {
    return tags
      .map(t => t.name)
      .filter(t => TAG_BLACKLIST.indexOf(t) === -1);
  }

  addTag(tag) {
    const oldTag = this.state.currentTags[0];
    const isDupe = () => tag.toLowerCase() === oldTag.toLowerCase();
    const newTags = !oldTag || isDupe() ? [tag] : [tag, oldTag];
    this.setState({ currentTags: newTags });
    this.fetchPlaylists({ tags: newTags });
  }

  removeTag(tag) {
    const index = this.state.currentTags.indexOf(tag);
    this.state.currentTags.splice(index, 1);
    this.setState({ currentTags: this.state.currentTags });
    return this.state.currentTags;
  }

  getCoverSize(size = 512) {
    if (this.state.playlist) {
      return this.state.playlist.cover + `&w=${size}&h=${size}`;
    }
  }

  mapPlaylists(playlists) {
    const mapPlaylist = playlist => {
      return {
        id: playlist.id,
        color: playlist.color_palette ? playlist.color_palette[3] : '#fff',
        cover: playlist.cover_urls.original,
      };
    };

    if (playlists.constructor === Array) {
      return knuthShuffle(playlists).map(playlist => mapPlaylist(playlist));
    } else {
      return mapPlaylist(playlists);
    }
  }

  mapTags(tags) {
    return tags
      .filter(tag => tag.name.length < 40)
      .map(tag => {
        if (tag.artist_avatar) {
          const image = tag.artist_avatar.replace('http://', 'https://');
          return { name: tag.name, image: image };
        } else {
          return tag.name;
        }
      });
  }

  mapTrack(track) {
    return {
      title: track.name.trim(),
      artist: track.performer.trim(),
      album: track.release_name.trim(),
      stream: track.track_file_stream_url,
    };
  }

  validPlaylist(playlist) {
    if (playlist) {
      const alreadyPlayed = this.played.includes(playlist.id);
      if (alreadyPlayed) this.fetchPlaylists();
      else return true;
    } else {
      const removableTags = this.state.currentTags.length > 1;
      if (removableTags) this.fetchPlaylists({ tags: this.removeTag(1) });
      else this.setState({ trackLoading: false });
    }

    return false;
  }

  storePlayed(id) {
    this.played.push(id);
    if (this.played.length > STORE_PLAYED_LIMIT) this.played.shift();
    store.set(STORE_PLAYED, this.played);
  }

  loadImage(src) {
    let img = new Image();

    img.onload = () => {
      this.setState({ playlistLoading: false });
      img = null;
    };

    img.src = src;
  }

  loadPlaylist(playlist, related) {
    const updatedState = {};
    if (related) updatedState.related = related;
    const valid = this.validPlaylist(playlist);

    if (valid) {
      updatedState.playlist = playlist;
      this.fetchNextSong(playlist.id);
      this.storePlayed(playlist.id);
    }

    this.setState(updatedState);
    if (valid) this.loadImage(this.getCoverSize());
  }

  updateTagData(tagString, data) {
    store.set(tagString, data, STORE_TAGS_EXPIRY);
  }

  fetchPlaylists({ tags = this.state.currentTags } = {}) {
    this.setState({
      track: false,
      trackLoading: true,
      playlistLoading: true,
      playerVisible: true
    });

    const cleanTags = tags.concat().sort().map(tag => tag.toLowerCase());
    const tagString = cleanTags.toString();
    const data = store.get(tagString) || { page: 0, index: 0 };

    if (data.playlists && data.index < data.playlists.length - 1) {
      data.index++;
      this.updateTagData(tagString, data);
      this.loadPlaylist(data.playlists[data.index], data.related);
    } else {
      data.page++;
      data.index = 0;

      api.playlists(cleanTags, 'hot', {
        include: 'mixes+explore_filters',
        page: data.page,
        per_page: PLAYLISTS_PER_PAGE,
      }).then(res => {
        data.playlists = this.mapPlaylists(res.mix_set.mixes);
        data.related = this.mapTags(res.filters);
        this.updateTagData(tagString, data);
        this.loadPlaylist(data.playlists[data.index], data.related);
      });
    }
  }

  fetchRelatedPlaylist(playlistId) {
    this.setState({ track: false, playlistLoading: true, trackLoading: true });

    api.nextPlaylist({ mix_id: playlistId }).then(res => {
      this.loadPlaylist(this.mapPlaylists(res.next_mix));
    });
  }

  fetchNextSong(playlistId) {
    playlistId = playlistId || this.state.playlist.id;

    if (!this.state.track || this.skipAllowed && !this.atLastTrack) {
      api.nextSong({ mix_id: playlistId }).then(res => {
        const track = this.mapTrack(res.set.track);
        this.setState({ track: track, trackLoading: false });
        this.skipAllowed = res.set.skip_allowed;
        this.atLastTrack = res.set.at_last_track;
      }, err => {
        this.fetchRelatedPlaylist(playlistId);
      });
    } else {
      this.fetchRelatedPlaylist(playlistId);
    }

    this.setState({ track: false, trackLoading: true });
  }

  renderDashboard() {
    return <Dashboard
      playerVisible={ this.state.playerVisible }
      addTag={ this.addTag }
      removeTag={ this.removeTag }
      currentTags={ this.state.currentTags }
      related={ this.state.related }
      topArtists={ this.state.topArtists }
      topTags={ this.state.topTags }
    />;
  }

  renderPlayer() {
    return <Player
      visible={ this.state.playerVisible }
      playlist={ this.state.playlist }
      playlistLoading={ this.state.playlistLoading }
      track={ this.state.track }
      trackLoading={ this.state.trackLoading }
      refresh={ this.fetchPlaylists }
      next={ this.fetchNextSong }
      getCoverSize={ this.getCoverSize }
    />;
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
