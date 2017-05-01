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
const STORE_TOP_ARTISTS_EXPIRY = help.daysFromNow(1);
const STORE_TOP_TAGS = '___top_tags';
const STORE_TOP_TAGS_EXPIRY = help.daysFromNow(1);
const STORE_PLAYED = '___played';
const STORE_PLAYED_LIMIT = 2000;
const STORE_TAG_DATA_EXPIRY = help.daysFromNow(7);
const CURRENT_TAG_LIMIT = 2;
const PLAYLISTS_PER_PAGE = 5;
const TAG_BLACKLIST = ['seen live', 'under 2000 listeners'];

export default class App extends Component {
  constructor() {
    super();
    store.addPlugin(expirePlugin);

    this.state = {
      playerVisible: false,
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
    this.topArtistsPage = 0;
    this.shuffleTopArtists = this.shuffleTopArtists.bind(this);
    this.shuffleTopTags = this.shuffleTopTags.bind(this);
    this.shuffleRelated = this.shuffleRelated.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.fetchPlaylists = this.fetchPlaylists.bind(this);
    this.fetchNextSong = this.fetchNextSong.bind(this);
    this.getCoverSize = this.getCoverSize.bind(this);
  }

  componentDidMount() {
    if (!this.state.topArtists.length) this.fetchTopArtists();
    else this.topArtistsPage++;
    if (!this.state.topTags.length) this.fetchTopTags();
  }

  fetchTopArtists() {
    this.topArtistsPage++;

    api.topArtists(30, this.topArtistsPage).then(res => {
      const artists = this.mapTopArtists(res.artists.artist);
      this.setState({ topArtists: [...this.state.topArtists, ...artists] });

      if (this.topArtistsPage === 1) {
        store.set(STORE_TOP_ARTISTS, artists, STORE_TOP_ARTISTS_EXPIRY);
      }
    });
  }

  mapTopArtists(artists) {
    return artists.map(a => {
      return { name: a.name, image: a.image[2]['#text'] };
    });
  }

  fetchTopTags(page) {
    api.topTags().then(res => {
      const tags = this.mapTopTags(res.tags.tag);
      this.setState({ topTags: tags });
      store.set(STORE_TOP_TAGS, tags, STORE_TOP_TAGS_EXPIRY);
    });
  }

  mapTopTags(tags) {
    return tags.map(t => t.name).filter(t => TAG_BLACKLIST.indexOf(t) === -1);
  }

  shuffleTopArtists() {
    this.setState({ topArtists: knuthShuffle(this.state.topArtists) });
    this.fetchTopArtists();
  }

  shuffleTopTags() {
    this.setState({ topTags: knuthShuffle(this.state.topTags) });
  }

  shuffleRelated() {
    this.setState({ related: knuthShuffle(this.state.related) });
  }

  addTag(newTag) {
    const newTags = this.state.currentTags
      .filter(tag => tag.toLowerCase() !== newTag.toLowerCase())
      .slice(0, CURRENT_TAG_LIMIT - 1);

    newTags.unshift(newTag);
    this.setState({ currentTags: newTags });
    this.fetchPlaylists({ tags: newTags });
  }

  removeTag(tag) {
    const tags = this.state.currentTags;
    const index = tag ? tags.indexOf(tag) : tags.length - 1;
    tags.splice(index, 1);
    this.setState({ currentTags: tags });
    return tags;
  }

  getCoverSize(size = 512) {
    if (this.state.playlist) {
      return this.state.playlist.cover + `&w=${size}&h=${size}`;
    }
  }

  mapPlaylists(playlists) {
    const mapPlaylist = playlist => {
      return { id: playlist.id, cover: playlist.cover_urls.original };
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
    if (!track) return false;

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
      if (removableTags) this.fetchPlaylists({ tags: this.removeTag() });
      else this.setState({ trackLoading: false });
    }

    return false;
  }

  storePlayed(id) {
    this.played.push(id);
    if (this.played.length > STORE_PLAYED_LIMIT) this.played.shift();
    store.set(STORE_PLAYED, this.played);
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
  }

  fetchPlaylists({ tags = this.state.currentTags } = {}) {
    this.setState({
      track: false,
      trackLoading: true,
      playerVisible: true,
    });

    const cleanTags = tags.concat().sort().map(tag => tag.toLowerCase());
    const tagHash = help.hash(cleanTags.toString());
    const data = store.get(tagHash) || { page: 0, index: 0 };

    if (data.playlists && data.index < data.playlists.length - 1) {
      data.index++;
      store.set(tagHash, data, STORE_TAG_DATA_EXPIRY);
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
        store.set(tagHash, data, STORE_TAG_DATA_EXPIRY);
        this.loadPlaylist(data.playlists[data.index], data.related);
      });
    }
  }

  fetchRelatedPlaylist(playlistId) {
    this.setState({ track: false, trackLoading: true });

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

  render() {
    return (
      <div className="App">
        <Dashboard
          playerVisible={ this.state.playerVisible }
          addTag={ this.addTag }
          removeTag={ this.removeTag }
          currentTags={ this.state.currentTags }
          related={ this.state.related }
          topArtists={ this.state.topArtists }
          topTags={ this.state.topTags }
          shuffleTopArtists={ this.shuffleTopArtists }
          shuffleTopTags={ this.shuffleTopTags }
          shuffleRelated={ this.shuffleRelated }
        />
        <Player
          visible={ this.state.playerVisible }
          playlist={ this.state.playlist }
          track={ this.state.track }
          trackLoading={ this.state.trackLoading }
          refresh={ this.fetchPlaylists }
          next={ this.fetchNextSong }
          getCoverSize={ this.getCoverSize }
        />
      </div>
    );
  }
}
