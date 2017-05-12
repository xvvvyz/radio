import 'whatwg-fetch';

const euc = encodeURIComponent;

const o2q = obj => {
  return Object.keys(obj).map(key => `${euc(key)}=${euc(obj[key])}`).join('&');
};

const t2q = tags => {
  const mapFunc = tag => {
    let q = tag
      .replace(/_/g, '__')
      .replace(/\+/g, '&&')
      .replace(/ /g, '_');

    q = euc(q)
      .replace(/\./g, '%5E');

    return q;
  };

  return tags.map(mapFunc).join('+');
};

const getJson = url => {
  return fetch(url).then(res => res.json());
};

const lastApi = params => {
  const base = 'https://ws.audioscrobbler.com/2.0';
  params.format = 'json';
  params.api_key = '4404bce8f9357c0c788326cf72515d50';
  return getJson(`${base}/?${o2q(params)}`);
};

const eightToken = id => {
  if (!eightToken[id]) {
    eightToken[id] = Math.floor(Math.random() * 100000000000000);
  }

  return eightToken[id];
};

const eightApi = (path, params, proxy = false) => {
  const base = proxy ? 'https://linerad.io/proxy' : 'https://8tracks.com';
  params.format = 'json';
  params.api_version = 3;
  params.api_key = '1dce5b8108f82a99ac4cb482fbd6fa96b9cfbec2';
  return getJson(`${base}/${path}?${o2q(params)}`);
};

export default {
  artists: (limit = 100, page = 1) => {
    return lastApi({ method: 'chart.gettopartists', page: page, limit: limit });
  },

  playlists: (tags, mode, params) => {
    return eightApi(`explore/${t2q(tags)}/${mode}`, params);
  },

  nextSong: (params, proxy = false) => {
    const token = eightToken(params.mix_id);
    return eightApi(`sets/${token}/next`, params, proxy);
  },

  skipSong: (params, proxy = false) => {
    const token = eightToken(params.mix_id);
    return eightApi(`sets/${token}/skip`, params, proxy);
  },

  nextPlaylist: params => {
    const token = eightToken(params.mix_id);
    return eightApi(`sets/${token}/next_mix.json`, params);
  },

  search: params => {
    return eightApi(`tags.json?${o2q(params)}`, params);
  },
};
