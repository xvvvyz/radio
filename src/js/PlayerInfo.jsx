import preact from 'preact';
import exitUp from '../svg/exit-up.svg';
import '../scss/PlayerInfo.scss';

const ORIGINAL_TITLE = document.title;

export default props => {
  document.title = ORIGINAL_TITLE;

  if (props.loading) return <div className="spinner" />;
  if (!props.track) return null;
  const { title, artist } = props.track;

  document.title = `${title} by ${artist}`;
  const searchQuery = encodeURIComponent(`${artist} ${title}`);
  const searchLink = `https://soundcloud.com/search/sounds?q=${searchQuery}`;

  return (
    <div className="PlayerInfo">
      <a href={searchLink} target="_blank">
        <span className="PlayerInfo_artist">{artist}</span>
        <span className="PlayerInfo_title">
          {title}&nbsp;<img src={exitUp} />
        </span>
      </a>
    </div>
  );
};
