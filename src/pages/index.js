import React from 'react';
import expirePlugin from 'store/plugins/expire';
import min from 'lodash/min';
import noop from 'lodash/noop';
import store from 'store';
import { knuthShuffle } from 'knuth-shuffle';
import Background from '../components/Background';
import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';
import Player from '../components/Player';
import api from '../utilities/api';
import data from '../utilities/data';

import { callGa, hash, parseUrl, setUrl } from '../utilities/helpers';

import {
  CURRENT_TAG_LIMIT,
  MAX_LIST_ITEMS,
  STORE_PLAYED,
  STORE_PLAYED_LIMIT,
  STORE_TAG_DATA_EXPIRY,
} from '../utilities/constants';

export default class Index extends React.Component {
  state = {
    apiError: false,
    artists: [],
    currentTags: [],
    deadEnd: false,
    genres: [],
    playerVisible: false,
    playlist: null,
    related: [],
    suggestions: [],
    track: null,
    trackLoading: true,
    footerVisible: false,
  };

  atLastTrack = false;
  played = store.get(STORE_PLAYED) || [];
  proxy = false;
  skipAllowed = true;
  spinDelay = 20;
  spinMax = 400;
  timeout = null;

  componentDidMount() {
    callGa('send', 'pageview');
    store.addPlugin(expirePlugin);
    store.removeExpiredKeys();
    this.addTags(parseUrl()).then(noop);
    this.getNewSuggestions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.suggestions !== this.state.suggestions) {
      if (this.spinDelay < this.spinMax) {
        this.timeout = window.setTimeout(
          this.getNewSuggestions,
          this.spinDelay
        );
      } else {
        this.spinDelay = 50;
      }
    }
  }

  addTags = async newTags => {
    if (!newTags) return;

    if (!Array.isArray(newTags)) {
      const newTag = newTags;

      newTags = this.state.currentTags
        .filter(tag => tag.toLowerCase() !== newTag.toLowerCase())
        .slice(0, CURRENT_TAG_LIMIT - 1);

      newTags.unshift(newTag);
      callGa('send', 'event', 'tags', 'add', newTag);
    }

    this.setState({ currentTags: newTags });
    setUrl(newTags);
    this.fetchPlaylist({ tags: newTags }).then(noop);
  };

  clearTimeout = () => {
    if (!this.timeout) return;
    window.clearTimeout(this.timeout);
  };

  fetchArtistTags = async artist => {
    const tags = await api.artistTags(artist);
    if (tags.length < MAX_LIST_ITEMS) return;
    this.setState({ genres: tags });
  };

  fetchNextSong = async (playlistId = this.state.playlist.id) => {
    this.setState({ trackLoading: true });

    if (this.atLastTrack) {
      this.fetchRelatedPlaylist(playlistId).then(noop);
      return;
    }

    try {
      this.loadTrack(await api.nextSong(playlistId, this.proxy)).then(noop);
    } catch (err) {
      if (this.proxy) {
        this.setState({ apiError: true });
      } else {
        this.proxy = true;
        this.fetchNextSong(playlistId).then(noop);
      }
    }
  };

  fetchPlaylist = async ({ tags = this.state.currentTags } = {}) => {
    this.setState({ trackLoading: true, playerVisible: true });

    const cleanTags = tags
      .concat()
      .sort()
      .map(tag => tag.toLowerCase());

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

    try {
      this.loadPlaylist(data.playlists[data.index], data.related).then(noop);
    } catch (err) {
      this.setState({ apiError: true });
    }
  };

  fetchRelatedPlaylist = async playlistId => {
    this.setState({ trackLoading: true });
    this.loadPlaylist(await api.nextPlaylist(playlistId)).then(noop);
  };

  fetchSimilarArtists = async artist => {
    const artists = await api.similarArtists(artist);
    if (artists.length < MAX_LIST_ITEMS) return;
    this.setState({ artists: artists });
  };

  getNewSuggestions = () => {
    const artists = this.state.artists.length
      ? this.state.artists.map(a => a.name)
      : data.artists;

    const genres = this.state.genres.length ? this.state.genres : data.genres;
    const shuffledArtistsAndGenres = knuthShuffle([...artists, ...genres]);
    const shuffledModifiers = knuthShuffle([...data.modifiers]);

    const maxSuggestions = min([
      shuffledArtistsAndGenres.length,
      shuffledModifiers.length,
    ]);

    let suggestions = [];

    for (let i = 0; i < maxSuggestions; i++) {
      suggestions.push([shuffledArtistsAndGenres[i], shuffledModifiers[i]]);
    }

    this.spinDelay = this.spinDelay * 1.25;
    this.setState({ suggestions });
  };

  loadPlaylist = async (playlist, related = this.state.related) => {
    this.atLastTrack = false;
    this.skipAllowed = true;

    if (!playlist && this.state.currentTags.length > 1) {
      this.fetchPlaylist({ tags: this.removeTag() }).then(noop);
      return;
    }

    if (!playlist) {
      this.setState({
        deadEnd: this.state.currentTags[0],
        playlist: null,
        track: null,
        trackLoading: false,
      });

      this.shuffleSuggestion();

      return;
    }

    if (this.played.includes(playlist.id)) {
      this.fetchPlaylist().then(noop);
      return;
    }

    this.storePlayed(playlist.id);
    this.setState({ apiError: false, deadEnd: false, playlist, related });
    this.fetchNextSong(playlist.id).then(noop);
  };

  loadTrack = async ({ atLastTrack, skipAllowed, track }) => {
    this.atLastTrack = atLastTrack;
    this.skipAllowed = skipAllowed;
    this.setState({ track, trackLoading: false });
    await this.fetchArtistTags(track.artist);
    await this.fetchSimilarArtists(track.artist);
    this.shuffleSuggestion();
    this.setState({ apiError: false, footerVisible: true });
  };

  removeTag = tag => {
    callGa('send', 'event', 'tags', 'remove', tag);
    const tags = this.state.currentTags;
    const index = tag ? tags.indexOf(tag) : tags.length - 1;
    tags.splice(index, 1);
    this.setState({ currentTags: tags });
    setUrl(tags);
    return tags;
  };

  shuffleArtists = () => {
    callGa('send', 'event', 'tags', 'shuffle', 'artists');
    this.setState({ artists: knuthShuffle(this.state.artists) });
  };

  shuffleGenres = () => {
    callGa('send', 'event', 'tags', 'shuffle', 'genres');
    this.setState({ genres: knuthShuffle(this.state.genres) });
  };

  shuffleRelated = () => {
    callGa('send', 'event', 'tags', 'shuffle', 'related');
    this.setState({ related: knuthShuffle(this.state.related) });
  };

  shuffleSuggestion = () => {
    this.clearTimeout();
    this.getNewSuggestions();
  };

  skipSong = async () => {
    this.setState({ trackLoading: true });

    if (!this.skipAllowed) {
      this.fetchRelatedPlaylist(this.state.playlist.id).then(noop);
      return;
    }

    try {
      const track = await api.skipSong(this.state.playlist.id, this.proxy);
      this.loadTrack(track).then(noop);
      this.setState({ trackLoading: false });
    } catch (e) {
      this.fetchRelatedPlaylist(this.state.playlist.id).then(noop);
    }
  };

  storePlayed = id => {
    this.played.push(id);
    if (this.played.length > STORE_PLAYED_LIMIT) this.played.shift();
    store.set(STORE_PLAYED, this.played);
  };

  render() {
    const {
      apiError,
      artists,
      currentTags,
      deadEnd,
      footerVisible,
      genres,
      playerVisible,
      playlist,
      related,
      suggestions,
      track,
      trackLoading,
    } = this.state;

    return (
      <Layout title={track ? `${track.title} by ${track.artist}` : null}>
        <Background hide={playerVisible} />
        <Dashboard
          addTags={this.addTags}
          artists={artists}
          currentTags={currentTags}
          footerVisible={footerVisible}
          genres={genres}
          playerVisible={playerVisible}
          related={related}
          removeTag={this.removeTag}
          shuffleArtists={this.shuffleArtists}
          shuffleGenres={this.shuffleGenres}
          shuffleRelated={this.shuffleRelated}
          suggestions={suggestions}
        />
        <Player
          apiError={apiError}
          deadEnd={deadEnd}
          next={this.fetchNextSong}
          playlist={playlist}
          refresh={this.fetchPlaylist}
          skip={this.skipSong}
          track={track}
          trackLoading={trackLoading}
          visible={playerVisible}
        />
      </Layout>
    );
  }
}
