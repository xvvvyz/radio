import {
  EIGHT_PAGE_LIMIT,
  LAST_METHOD_ARTIST_SIMILAR,
  LAST_METHOD_ARTIST_TAGS,
  LAST_PAGE_LIMIT,
} from './constants';

import {
  callEightApi,
  callLastApi,
  getToken,
  selectArtistTags,
  selectArtists,
  selectPlaylistTags,
  selectPlaylists,
  selectTrack,
  tagsToQuery,
} from './helpers';

export default {
  artistTags: async (artist) => {
    const res = await callLastApi({
      artist,
      limit: LAST_PAGE_LIMIT,
      method: LAST_METHOD_ARTIST_TAGS,
    });

    return selectArtistTags(res);
  },

  nextPlaylist: async (id) => {
    const res = await callEightApi(`sets/${getToken(id)}/next_mix.json`, {
      mix_id: id,
    });

    return selectPlaylists(res);
  },

  nextSong: async (id, proxy = false) => {
    const res = await callEightApi(
      `sets/${getToken(id)}/next`,
      { mix_id: id },
      proxy
    );

    return selectTrack(res);
  },

  playlists: async ({ page, tags }) => {
    const res = await callEightApi(`explore/${tagsToQuery(tags)}/hot`, {
      include: 'mixes+explore_filters',
      page: page,
      per_page: EIGHT_PAGE_LIMIT,
    });

    return {
      playlists: selectPlaylists(res),
      related: selectPlaylistTags(res),
    };
  },

  search: async (query) => {
    const res = await callEightApi('tags.json', { q: query, per_page: 10 });
    return res.tag_cloud.tags;
  },

  similarArtists: async (artist) => {
    const res = await callLastApi({
      artist,
      limit: LAST_PAGE_LIMIT,
      method: LAST_METHOD_ARTIST_SIMILAR,
    });

    return selectArtists(res);
  },

  skipSong: async (id, proxy = false) => {
    const res = await callEightApi(
      `sets/${getToken(id)}/skip`,
      { mix_id: id },
      proxy
    );

    return selectTrack(res);
  },
};
