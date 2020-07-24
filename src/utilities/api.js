import {
  EIGHT_PAGE_LIMIT,
  LAST_METHOD_ARTIST_TAGS,
  LAST_PAGE_LIMIT,
} from './constants';

import {
  callEightApi,
  callLastApi,
  callLastApiv2,
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
    const res = await callEightApi(`explore/${tagsToQuery(tags)}/recent`, {
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
    const res = await callEightApi('algolia/search.json', { q: query });

    return res.results.map((r) => ({
      image: r.image_url || null,
      name: r.term,
    }));
  },

  similarArtists: async (artist) => {
    const res = await callLastApiv2('similarartists', {
      artist: artist.replace(/ /g, '+'),
      autocorrect: 1,
      image_size: 'medium',
      limit: LAST_PAGE_LIMIT,
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

  topArtists: async () => {
    const res = await callLastApiv2('charts', {
      type: 'artist',
      image_size: 'medium',
      nr: 200,
    });

    return selectArtists(res);
  },

  topTags: async () => {
    const res = await callLastApiv2('charts', {
      type: 'tag',
      image_size: 'medium',
      nr: 50,
    });

    return res?.results?.tag || [];
  },
};
