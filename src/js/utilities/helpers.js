import { knuthShuffle } from 'knuth-shuffle';
import 'whatwg-fetch';

import {
  EIGHT_API_KEY,
  LAST_API_KEY,
  MAX_TAG_CHARACTER_LENGTH,
} from './constants';

export const callEightApi = (path, params, proxy = false) => {
  const base = proxy ? 'https://r51c7dwz23.execute-api.us-west-2.amazonaws.com/prod' : 'https://8tracks.com';

  const qs = objectToQuery({
    ...params,
    api_key: EIGHT_API_KEY,
    api_version: 3,
    format: 'json',
  });

  return getJson(`${base}/${path}${qs}`);
};

export const callLastApi = params => {
  const qs = objectToQuery({
    ...params,
    api_key: LAST_API_KEY,
    format: 'json',
  });

  return getJson(`https://ws.audioscrobbler.com/2.0/${qs}`);
};

export const daysFromNow = days => {
  return new Date().getTime() + 1000 * 60 * 60 * 24 * days;
};

export const getJson = url => {
  return fetch(url).then(res => res.json());
};

export const getToken = key => {
  window.tokens = window.tokens || {};
  if (!tokens[key]) tokens[key] = Math.floor(Math.random() * 10000000000000);
  return tokens[key];
};

export const hash = str => {
  return str.split('').reduce((prevHash, currVal) => {
    return Math.abs(((prevHash << 5) - prevHash) + currVal.charCodeAt(0));
  }, 0);
};

export const objectToQuery = obj => {
  return '?' + Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

export const parseUrl = () => {
  const hash = window.location.hash.split('#')[1];
  if (!hash) return false;

  return hash
    .replace(/_/g, ' ')
    .replace(/\[underscore]/g, '_')
    .replace(/\[hashtag]/g, '#')
    .split('+')
    .map(tag => decodeURIComponent(tag.replace(/\[plus]/g, '+')));
};

export const selectArtists = data => {
  const artists = (data.artists || {}).artist ||
    (data.similarartists || {}).artist || [];

  return artists
    .filter(a => a.streamable)
    .filter(a => a.name.length < MAX_TAG_CHARACTER_LENGTH)
    .filter(a => !a.name.includes('/'))
    .map(a => ({ name: a.name, image: a.image[1]['#text'] }))
    .filter(a => a.image);
};

export const selectArtistTags = data => {
  return ((data.toptags || {}).tag || [])
    .filter(t => t.name.length < MAX_TAG_CHARACTER_LENGTH)
    .map(t => t.name);
};

export const selectPlaylists = data => {
  const playlists = data.next_mix || (data.mix_set || {}).mixes || [];

  const mapPlaylist = playlist => ({
    id: playlist.id,
    cover: playlist.cover_urls.original,
  });

  return Array.isArray(playlists)
    ? knuthShuffle(playlists).map(mapPlaylist)
    : mapPlaylist(playlists);
};

export const selectPlaylistTags = data => {
  return data.filters
    .filter(tag => tag.name.length < MAX_TAG_CHARACTER_LENGTH)
    .map(tag => tag.artist_avatar
      ? { name: tag.name, image: tag.artist_avatar.replace('http:', 'https:') }
      : tag.name);
};

export const selectTrack = data => {
  return {
    atLastTrack: data.set.at_last_track,
    skipAllowed: data.set.skip_allowed,
    track: {
      album: data.set.track.release_name.trim(),
      artist: data.set.track.performer.trim(),
      stream: data.set.track.track_file_stream_url,
      title: data.set.track.name.trim(),
    },
  };
};

export const setUrl = tags => {
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

export const tagsToQuery = tags => {
  tags = tags.map(tag => {
    tag = tag.replace(/_/g, '__').replace(/\+/g, '&&').replace(/ /g, '_');
    return encodeURIComponent(tag).replace(/\./g, '%5E');
  });

  return tags.join('+');
};
