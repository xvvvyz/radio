import PropTypes from 'prop-types';
import React from 'react';
import Tag from './Tag';
import './CurrentTags.scss';

const CurrentTags = props => !!props.currentTags.length && (
  <ul className="CurrentTags">
    {props.currentTags.map((tag, i) => (
      <Tag key={i} onClick={props.removeTag} value={tag} />
    ))}
  </ul>
);

CurrentTags.propTypes = {
  currentTags: PropTypes.array.isRequired,
};

export default CurrentTags;
