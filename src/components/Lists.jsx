import PropTypes from 'prop-types';
import React from 'react';
import List from './List';
import { MAX_LIST_ITEMS } from '../utilities/constants';
import './Lists.scss';

const Lists = (props) => (
  <section className="Lists">
    <List
      addTags={props.addTags}
      items={props.artists.slice(0, MAX_LIST_ITEMS)}
      shuffle={props.shuffleArtists}
      title="Artists"
    />
    <List
      addTags={props.addTags}
      items={props.genres.slice(0, MAX_LIST_ITEMS)}
      shuffle={props.shuffleGenres}
      title="Genres"
    />
    <List
      addTags={props.addTags}
      items={props.related.slice(0, MAX_LIST_ITEMS)}
      shuffle={props.shuffleRelated}
      title="Suggested"
    />
  </section>
);

Lists.propTypes = {
  addTags: PropTypes.func.isRequired,
  artists: PropTypes.array.isRequired,
  genres: PropTypes.array.isRequired,
  related: PropTypes.array.isRequired,
  shuffleArtists: PropTypes.func.isRequired,
  shuffleGenres: PropTypes.func.isRequired,
  shuffleRelated: PropTypes.func.isRequired,
};

export default Lists;
