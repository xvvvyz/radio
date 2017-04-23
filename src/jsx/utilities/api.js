import 'whatwg-fetch';

const API_HOST = 'https://8tracks.com';
const TOKEN_MULTIPLIER = 100000000000000;
const tokens = {};

const getJson = url => {
  return fetch(url).then(res => res.json());
};

const getToken = id => {
  if (!tokens[id]) {
    tokens[id] = Math.floor(Math.random() * TOKEN_MULTIPLIER);
  }

  return tokens[id];
};

const toQuery = obj => {
  obj.format = 'json';
  obj.api_version = 3;
  obj.api_key = '1dce5b8108f82a99ac4cb482fbd6fa96b9cfbec2';
  const euc = encodeURIComponent;
  return Object.keys(obj).map(key => `${euc(key)}=${euc(obj[key])}`).join('&');
};

const tagsToQuery = tags => {
  const mapFunc = tag => {
    tag = tag.replace(/_/g, '__')
      .replace(/\+/g, '&&')
      .replace(/ /g, '_');

    tag = encodeURIComponent(tag);
    tag = tag.replace(/\./g, '%5E');

    return tag;
  };

  return tags.map(mapFunc).join('+');
};

export default {
  explore: params => {
    const query = toQuery(params);
    return getJson(`${API_HOST}/explore_filters?${query}`);
  },

  playlists: (tags, params, mode = 'hot') => {
    const tagQuery = tagsToQuery(tags);
    const query = toQuery(params);
    return getJson(`${API_HOST}/explore/${tagQuery}/${mode}?${query}`);
  },

  nextSong: params => {
    const token = getToken(params.mix_id);
    const query = toQuery(params);
    return getJson(`${API_HOST}/sets/${token}/next?${query}`);
  },

  nextPlaylist: params => {
    const token = getToken(params.mix_id);
    const query = toQuery(params);
    return getJson(`${API_HOST}/sets/${token}/next_mix.json?${query}`);
  },

  search: params => {
    const query = toQuery(params);
    return getJson(`${API_HOST}/tags.json?${query}`);
  }
};
