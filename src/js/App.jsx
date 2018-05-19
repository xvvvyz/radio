import preact from 'preact';
import { knuthShuffle } from 'knuth-shuffle';
import store from 'store';
import expirePlugin from 'store/plugins/expire';
import Dashboard from './Dashboard';
import Player from './Player';
import api from './utilities/api';
import data from './utilities/data';
import { hash } from './utilities/helpers';
import '../scss/App.scss';

import {
  CURRENT_TAG_LIMIT,
  PLAYLISTS_PER_PAGE,
  STORE,
} from './utilities/constants';

export default class App extends preact.Component {
  state = {
    artists: [],
    currentTags: [],
    genres: data.genres,
    playerVisible: false,
    playlist: false,
    related: [],
    track: false,
    trackLoading: true,
  };

  atLastTrack = false;
  played = store.get(STORE.PLAYED) || [];
  proxy = false;
  skipAllowed = true;

  componentDidMount() {
    ga('send', 'pageview');
    store.addPlugin(expirePlugin);
    store.removeExpiredKeys();

    this.fetchArtists();
    this.parseUrl();
  }

  fetchArtists = () => {
    api.artists().then(res => {
      this.setState({ artists: this.mapArtists(res.artists.artist) });
    });
  };

  mapArtists = artists => {
    return artists
      .filter(a => a.streamable)
      .map(a => ({ name: a.name, image: a.image[1]['#text']}))
      .filter(a => a.image)
      .filter(a => a.name.length < 25);
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

  addTags = newTags => {
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
  };

  setUrl = tags => {
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
  };

  parseUrl = () => {
    const hash = window.location.hash.split('#')[1];
    if (!hash) return;

    const tags = hash
      .replace(/_/g, ' ')
      .replace(/\[underscore\]/g, '_')
      .replace(/\[hashtag\]/g, '#')
      .split('+')
      .map(tag => tag.replace(/\[plus\]/g, '+'));

    this.addTags(tags);
  };

  removeTag = tag => {
    ga('send', 'event', 'tags', 'remove', tag);
    const tags = this.state.currentTags;
    const index = tag ? tags.indexOf(tag) : tags.length - 1;
    tags.splice(index, 1);
    this.setState({ currentTags: tags });
    this.setUrl(tags);
    return tags;
  };

  getCoverSize = (size = 512) => {
    if (this.state.playlist) {
      return this.state.playlist.cover + `&w=${size}&h=${size}`;
    }
  };

  mapPlaylists = playlists => {
    const mapPlaylist = playlist => ({
      id: playlist.id,
      cover: playlist.cover_urls.original,
    });

    return Array.isArray(playlists)
      ? knuthShuffle(playlists).map(playlist => mapPlaylist(playlist))
      : mapPlaylist(playlists);
  };

  mapTags = tags => {
    return tags
      .filter(tag => tag.name.length < 40)
      .map(tag => ({ name: tag.name, image: tag.artist_avatar }));
  };

  mapTrack = track => {
    return {
      title: track.name.trim(),
      artist: track.performer.trim(),
      album: track.release_name.trim(),
      stream: track.track_file_stream_url,
    };
  };

  validPlaylist = playlist => {
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
  };

  storePlayed = id => {
    this.played.push(id);
    if (this.played.length > STORE.PLAYED_LIMIT) this.played.shift();
    store.set(STORE.PLAYED, this.played);
  };

  loadPlaylist = (playlist, related) => {
    const updatedState = {};
    updatedState.related = related ? related : this.state.related;
    const valid = this.validPlaylist(playlist);

    if (valid) {
      updatedState.playlist = playlist;
      this.fetchNextSong(playlist.id);
      this.storePlayed(playlist.id);
    }

    this.setState(updatedState);
  };

  fetchPlaylists = ({ tags = this.state.currentTags } = {}) => {
    this.setState({
      track: false,
      trackLoading: true,
      playerVisible: true,
    });

    const cleanTags = tags.concat().sort().map(tag => tag.toLowerCase());
    const tagHash = hash(cleanTags.toString());
    const data = store.get(tagHash) || { page: 0, index: 0 };

    if (data.playlists && data.index < data.playlists.length - 1) {
      data.index++;
      store.set(tagHash, data, STORE.TAG_DATA_EXPIRY);
      this.loadPlaylist(data.playlists[data.index], data.related);
    } else {
      data.page++;
      data.index = 0;

      api.playlists(cleanTags, 'recent', {
        include: 'mixes+explore_filters',
        page: data.page,
        per_page: PLAYLISTS_PER_PAGE,
      }).then(res => {
        data.playlists = this.mapPlaylists(res.mix_set.mixes);
        data.related = this.mapTags(res.filters);
        store.set(tagHash, data, STORE.TAG_DATA_EXPIRY);
        this.loadPlaylist(data.playlists[data.index], data.related);
      });
    }
  };

  fetchRelatedPlaylist = playlistId => {
    this.setState({ track: false, trackLoading: true });

    api.nextPlaylist({ mix_id: playlistId }).then(res => {
      this.loadPlaylist(this.mapPlaylists(res.next_mix));
    });
  };

  loadTrack = res => {
    if (!(((res || {}).set || {}).track || {}).name) return false;
    const track = this.mapTrack(res.set.track);
    this.setState({ track: track, trackLoading: false });
    this.skipAllowed = res.set.skip_allowed;
    this.atLastTrack = res.set.at_last_track;
    api.relatedArtists(track.artist).then(res => {
      const artists = this.mapArtists(res.similarartists.artist);
      if (artists.length < 6) return;
      this.setState({ artists });
    });
    api.artistTags(track.artist).then(res => {
      const related = res.toptags.tag.map(t => t.name);
      if (related.length < 6) return;
      this.setState({ genres: related })
    });
    return true;
  };

  fetchNextSong = playlistId => {
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
  };

  skipSong = () => {
    this.setState({ track: false, trackLoading: true });

    if (this.skipAllowed) {
      const options = { mix_id: this.state.playlist.id };
      api.skipSong(options, this.proxy).then(this.loadTrack);
    } else {
      this.fetchRelatedPlaylist(this.state.playlist.id);
    }
  };

  render() {
    return (
      <div className="App">
        <Dashboard
          playerVisible={this.state.playerVisible}
          addTags={this.addTags}
          removeTag={this.removeTag}
          currentTags={this.state.currentTags}
          related={this.state.related}
          artists={this.state.artists}
          genres={this.state.genres}
          shuffleArtists={this.shuffleArtists}
          shuffleGenres={this.shuffleGenres}
          shuffleRelated={this.shuffleRelated}
        />
        <Player
          visible={this.state.playerVisible}
          playlist={this.state.playlist}
          track={this.state.track}
          trackLoading={this.state.trackLoading}
          refresh={this.fetchPlaylists}
          next={this.fetchNextSong}
          skip={this.skipSong}
          getCoverSize={this.getCoverSize}
        />
      </div>
    );
  }
}
