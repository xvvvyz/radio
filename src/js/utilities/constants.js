import { daysFromNow } from './helpers';

export const CURRENT_TAG_LIMIT = 2;

export const PLAYLISTS_PER_PAGE = 5;

export const STORE = {
  ARTISTS: '___top_artists',
  ARTISTS_EXPIRY: daysFromNow(1),
  PLAYED: '___played',
  PLAYED_LIMIT: 2000,
  TAG_DATA_EXPIRY: daysFromNow(7),
  TAG_LIMIT: 2,
};
