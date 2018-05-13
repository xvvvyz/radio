import preact from 'preact';
import exitUp from '../svg/exit-up.svg';
import '../scss/PlayerInfo.scss';

const ORIGINAL_TITLE = document.title;

export default props => {
  document.title = ORIGINAL_TITLE;

  if (props.loading) return <div className="spinner" />;
  if (!props.title && !props.artist) return;

  document.title = `${props.title} by ${props.artist}`;
  const searchQuery = encodeURIComponent(`${props.artist} ${props.title}`);
  const searchLink = `https://soundcloud.com/search/sounds?q=${searchQuery}`;

  return (
    <div className="PlayerInfo">
      <a href={searchLink} target="_blank">
        <span className="PlayerInfo_artist">{props.artist}</span>
        <span className="PlayerInfo_title">
          {props.title}&nbsp;<img src={exitUp} />
        </span>
      </a>
    </div>
  );
};
