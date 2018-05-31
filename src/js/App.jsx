import preact from 'preact';
import { knuthShuffle } from 'knuth-shuffle';
import store from 'store';
import expirePlugin from 'store/plugins/expire';
import Dashboard from './Dashboard';
import Player from './Player';
import api from './utilities/api';
import data from './utilities/data';
import { hash, parseUrl, setUrl } from './utilities/helpers';
import '../scss/App.scss';

import {
  CURRENT_TAG_LIMIT,
  MAX_LIST_ITEMS,
  STORE_PLAYED,
  STORE_PLAYED_LIMIT,
  STORE_TAG_DATA_EXPIRY,
} from './utilities/constants';

export default class App extends preact.Component {
  state = {
    artists: [],
    currentTags: [],
    deadEnd: false,
    genres: data.genres,
    playerVisible: false,
    playlist: null,
    related: [],
    track: null,
    trackLoading: true,
  };

  atLastTrack = false;
  played = store.get(STORE_PLAYED) || [];
  proxy = false;
  skipAllowed = true;

  componentDidMount() {
    ga('send', 'pageview');
    store.addPlugin(expirePlugin);
    store.removeExpiredKeys();
    this.addTags(parseUrl());
    this.fetchArtists();
  }

  addTags = async newTags => {
    if (!newTags) return;

    if (!Array.isArray(newTags)) {
      const newTag = newTags;

      newTags = this.state.currentTags
        .filter(tag => tag.toLowerCase() !== newTag.toLowerCase())
        .slice(0, CURRENT_TAG_LIMIT - 1);

      newTags.unshift(newTag);
      ga('send', 'event', 'tags', 'add', newTag);
    }

    this.setState({ currentTags: newTags });
    setUrl(newTags);
    this.fetchPlaylist({ tags: newTags });
  };

  fetchArtists = async () => {
    this.setState({ artists: await api.topArtists() });
  };

  fetchArtistTags = async artist => {
    const tags = await api.artistTags(artist);
    if (tags.length < MAX_LIST_ITEMS) return;
    this.setState({ genres: tags });
  };

  fetchNextSong = async (playlistId = this.state.playlist.id) => {
    this.setState({ trackLoading: true });

    if (this.atLastTrack) {
      this.fetchRelatedPlaylist(playlistId);
      return;
    }

    try {
      this.loadTrack(await api.nextSong(playlistId, this.proxy));
    } catch (err) {
      if (this.proxy) return;
      this.proxy = true;
      this.fetchNextSong(playlistId);
    }
  };

  fetchPlaylist = async ({ tags = this.state.currentTags } = {}) => {
    this.setState({ trackLoading: true, playerVisible: true });

    const cleanTags = tags.concat().sort().map(tag => tag.toLowerCase());
    const tagHash = hash(cleanTags.toString());
    const data = store.get(tagHash) || { page: 0, index: 0 };

    if (data.playlists && data.index < data.playlists.length - 1) {
      data.index++;
      store.set(tagHash, data, STORE_TAG_DATA_EXPIRY);
    } else {
      data.page++;
      data.index = 0;

      const res = await api.playlists({ page: data.page, tags: cleanTags });
      data.playlists = res.playlists;
      data.related = res.related;

      store.set(tagHash, data, STORE_TAG_DATA_EXPIRY);
    }

    await this.loadPlaylist(data.playlists[data.index], data.related);
  };

  fetchSimilarArtists = async artist => {
    const artists = await api.similarArtists(artist);
    if (artists.length < MAX_LIST_ITEMS) return;
    this.setState({ artists: artists });
  };

  fetchRelatedPlaylist = async playlistId => {
    this.setState({ trackLoading: true });
    this.loadPlaylist(await api.nextPlaylist(playlistId));
  };

  loadPlaylist = async (playlist, related = this.state.related) => {
    this.skipAllowed = true;

    if (!playlist && this.state.currentTags.length > 1) {
      this.fetchPlaylist({ tags: this.removeTag() });
      return;
    }

    if (!playlist) {
      this.setState({
        deadEnd: this.state.currentTags[0],
        playlist: null,
        track: null,
        trackLoading: false,
      });

      return;
    }

    if (this.played.includes(playlist.id)) {
      this.fetchPlaylist();
      return;
    }

    this.storePlayed(playlist.id);
    this.setState({ deadEnd: false, playlist, related });
    this.fetchNextSong(playlist.id);
  };

  loadTrack = ({ atLastTrack, skipAllowed, track }) => {
    this.atLastTrack = atLastTrack;
    this.skipAllowed = skipAllowed;
    this.setState({ track, trackLoading: false });
    this.fetchSimilarArtists(track.artist);
    this.fetchArtistTags(track.artist);
  };

  removeTag = tag => {
    ga('send', 'event', 'tags', 'remove', tag);
    const tags = this.state.currentTags;
    const index = tag ? tags.indexOf(tag) : tags.length - 1;
    tags.splice(index, 1);
    this.setState({ currentTags: tags });
    setUrl(tags);
    return tags;
  };

  shuffleArtists = () => {
    ga('send', 'event', 'tags', 'shuffle', 'artists');
    this.setState({ artists: knuthShuffle(this.state.artists) });
  };

  shuffleGenres = () => {
    ga('send', 'event', 'tags', 'shuffle', 'genres');
    this.setState({ genres: knuthShuffle(this.state.genres) });
  };

  shuffleRelated = () => {
    ga('send', 'event', 'tags', 'shuffle', 'related');
    this.setState({ related: knuthShuffle(this.state.related) });
  };

  skipSong = async () => {
    this.setState({ trackLoading: true });

    if (!this.skipAllowed) {
      this.fetchRelatedPlaylist(this.state.playlist.id);
      return;
    }

    try {
      this.loadTrack(await api.skipSong(this.state.playlist.id, this.proxy));
      this.setState({ trackLoading: false });
    } catch (e) {
      this.fetchRelatedPlaylist(this.state.playlist.id);
    }
  };

  storePlayed = id => {
    this.played.push(id);
    if (this.played.length > STORE_PLAYED_LIMIT) this.played.shift();
    store.set(STORE_PLAYED, this.played);
  };

  render() {
    return (
      <div>
        <Dashboard
          addTags={this.addTags}
          artists={this.state.artists}
          currentTags={this.state.currentTags}
          genres={this.state.genres}
          playerVisible={this.state.playerVisible}
          related={this.state.related}
          removeTag={this.removeTag}
          shuffleArtists={this.shuffleArtists}
          shuffleGenres={this.shuffleGenres}
          shuffleRelated={this.shuffleRelated}
        />
        <Player
          deadEnd={this.state.deadEnd}
          next={this.fetchNextSong}
          playlist={this.state.playlist}
          refresh={this.fetchPlaylist}
          skip={this.skipSong}
          track={this.state.track}
          trackLoading={this.state.trackLoading}
          visible={this.state.playerVisible}
        />
      </div>
    );
  }
}
