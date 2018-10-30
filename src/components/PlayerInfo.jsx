import PropTypes from 'prop-types';
import React from 'react';
import exitUp from '../icons/exit-up.svg';
import '../styles/PlayerInfo.scss';

const PlayerInfo = props => {
  if (props.loading) return <div className="spinner" />;
  if (!props.track) return null;
  const { title, artist } = props.track;

  const searchQuery = encodeURIComponent(`${artist} ${title}`);
  const searchLink = `https://soundcloud.com/search/sounds?q=${searchQuery}`;

  return (
    <div className="PlayerInfo">
      <a href={searchLink} rel="noopener noreferrer" target="_blank">
        <span className="PlayerInfo_artist">{artist}</span>
        <span className="PlayerInfo_title">
          {title}&nbsp;<img alt="external link" src={exitUp} />
        </span>
      </a>
    </div>
  );
};

PlayerInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  track: PropTypes.shape({
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
};

export default PlayerInfo;
