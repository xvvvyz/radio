import Inferno from 'inferno';
import Component from 'inferno-component';
import { knuthShuffle } from 'knuth-shuffle';
import store from 'store';
import expirePlugin from 'store/plugins/expire';
import Dashboard from './Dashboard.jsx';
import Player from './Player.jsx';
import api from './utilities/api.js';
import data from './utilities/data.js';
import help from './utilities/helpers.js';
import '../scss/App.scss';

const STORE_ARTISTS = '___top_artists';
const STORE_ARTISTS_EXPIRY = help.daysFromNow(1);
const STORE_PLAYED = '___played';
const STORE_PLAYED_LIMIT = 2000;
const STORE_TAG_DATA_EXPIRY = help.daysFromNow(7);
const CURRENT_TAG_LIMIT = 2;
const PLAYLISTS_PER_PAGE = 5;

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
      artists: store.get(STORE_ARTISTS) || [],
      genres: data.genres,
      related: [],
    };

    this.played = store.get(STORE_PLAYED) || [];
    this.skipAllowed = true;
    this.atLastTrack = false;
    this.proxy = false;

    this.shuffleArtists = this.shuffleArtists.bind(this);
    this.shuffleGenres = this.shuffleGenres.bind(this);
    this.shuffleRelated = this.shuffleRelated.bind(this);
    this.addTags = this.addTags.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.fetchPlaylists = this.fetchPlaylists.bind(this);
    this.loadTrack = this.loadTrack.bind(this);
    this.fetchNextSong = this.fetchNextSong.bind(this);
    this.skipSong = this.skipSong.bind(this);
    this.getCoverSize = this.getCoverSize.bind(this);
  }

  componentDidMount() {
    if (!this.state.artists.length) this.fetchartists();
    this.parseUrl();
  }

  fetchartists() {
    this.artistsPage++;

    api.artists().then(res => {
      const artists = res.artists.artist.map(a => a.name);
      this.setState({ artists: artists });
      store.set(STORE_ARTISTS, artists, STORE_ARTISTS_EXPIRY);
    });
  }

  shuffleArtists() {
    ga('send', 'event', 'tags', 'shuffle', 'artists');
    this.setState({ artists: knuthShuffle(this.state.artists) });
  }

  shuffleGenres() {
    ga('send', 'event', 'tags', 'shuffle', 'genres');
    this.setState({ genres: knuthShuffle(this.state.genres) });
  }

  shuffleRelated() {
    ga('send', 'event', 'tags', 'shuffle', 'related');
    this.setState({ related: knuthShuffle(this.state.related) });
  }

  addTags(newTags) {
    if (newTags.constructor !== Array) {
      const newTag = newTags;

      newTags = this.state.currentTags
        .filter(tag => tag.toLowerCase() !== newTag.toLowerCase())
        .slice(0, CURRENT_TAG_LIMIT - 1);

      newTags.unshift(newTag);
      ga('send', 'event', 'tags', 'add', newTag);
    }

    this.setState({ currentTags: newTags });
    this.fetchPlaylists({ tags: newTags });
    this.setUrl(newTags);
  }

  setUrl(tags) {
    const mapTags = tag => {
      return tag
        .replace(/_/g, '[underscore]')
        .replace(/ /g, '_')
        .replace(/#/g, '[hashtag]')
        .replace(/\+/g, '[plus]');
    };

    if (tags.length) {
      tags = tags.map(mapTags).join('+');
      history.replaceState({}, document.title, '#' + tags);
    } else {
      history.replaceState({}, document.title, '/');
    }
  }

  parseUrl() {
    const hash = window.location.hash.split('#')[1];
    if (!hash) return;

    const tags = hash
      .replace(/_/g, ' ')
      .replace(/\[underscore\]/g, '_')
      .replace(/\[hashtag\]/g, '#')
      .split('+')
      .map(tag => tag.replace(/\[plus\]/g, '+'));

    this.addTags(tags);
  }

  removeTag(tag) {
    ga('send', 'event', 'tags', 'remove', tag);
    const tags = this.state.currentTags;
    const index = tag ? tags.indexOf(tag) : tags.length - 1;
    tags.splice(index, 1);
    this.setState({ currentTags: tags });
    this.setUrl(tags);
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
    return tags.filter(tag => tag.name.length < 40).map(tag => tag.name);
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
    updatedState.related = related ? related : this.state.related;
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

  loadTrack(res) {
    if (!(((res || {}).set || {}).track || {}).name) return false;
    const track = this.mapTrack(res.set.track);
    this.setState({ track: track, trackLoading: false });
    this.skipAllowed = res.set.skip_allowed;
    this.atLastTrack = res.set.at_last_track;
    return true;
  }

  fetchNextSong(playlistId) {
    this.setState({ track: false, trackLoading: true });
    playlistId = playlistId || this.state.playlist.id;

    if (!this.state.track || !this.atLastTrack) {
      api.nextSong({ mix_id: playlistId }, this.proxy).then(res => {
        if (!this.loadTrack(res)) this.fetchRelatedPlaylist(playlistId);
      }).catch(err => {
        if (!this.proxy) {
          this.proxy = true;
          this.fetchNextSong(playlistId);
        }
      });
    } else {
      this.fetchRelatedPlaylist(playlistId);
    }
  }

  skipSong() {
    this.setState({ track: false, trackLoading: true });

    if (this.skipAllowed) {
      const options = { mix_id: this.state.playlist.id };
      api.skipSong(options, this.proxy).then(this.loadTrack);
    } else {
      this.fetchRelatedPlaylist(this.state.playlist.id);
    }
  }

  render() {
    return (
      <div className="App">
        <Dashboard
          playerVisible={ this.state.playerVisible }
          addTags={ this.addTags }
          removeTag={ this.removeTag }
          currentTags={ this.state.currentTags }
          related={ this.state.related }
          artists={ this.state.artists }
          genres={ this.state.genres }
          shuffleArtists={ this.shuffleArtists }
          shuffleGenres={ this.shuffleGenres }
          shuffleRelated={ this.shuffleRelated }
        />
        <Player
          visible={ this.state.playerVisible }
          playlist={ this.state.playlist }
          track={ this.state.track }
          trackLoading={ this.state.trackLoading }
          refresh={ this.fetchPlaylists }
          next={ this.fetchNextSong }
          skip={ this.skipSong }
          getCoverSize={ this.getCoverSize }
        />
      </div>
    );
  }
}
