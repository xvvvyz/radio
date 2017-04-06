import 'whatwg-fetch';

const API_HOST = 'https://8tracks.com';

const json = url => {
  return fetch(url).then(res => res.json());
};

const toQuery = obj => {
  obj.format = 'json';
  obj.api_version = 3;
  obj.api_key = '1dce5b8108f82a99ac4cb482fbd6fa96b9cfbec2';

  return Object
    .keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
  ;
};

const tagsToQuery = tags => {
  const mapFunc = tag => {
    tag = tag.replace(/_/g, '__')
      .replace(/\+/g, '&&')
      .replace(/ /g, '_');

    tag = encodeURIComponent(tag);
    return tag.replace(/\./g, '%5E');
  };

  return tags.map(mapFunc).join('+');
};

export default {
  explore: params => {
    return json(`${API_HOST}/explore_filters?${toQuery(params)}`);
  },

  playlists: (tags, params) => {
    return json(`${API_HOST}/explore/${tagsToQuery(tags)}/hot?${toQuery(params)}`);
  },

  nextSong: params => {
    params.player = 'sm';
    return json(`${API_HOST}/sets/366228187/next?${toQuery(params)}`);
  },
};
