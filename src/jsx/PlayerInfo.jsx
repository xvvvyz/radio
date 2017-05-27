import Inferno from 'inferno';
import Component from 'inferno-component';
import Svg from './Svg.jsx';
import '../scss/PlayerInfo.scss';
import exitUp from '../svg/exit-up.svg';

const originalTitle = document.title;

export default function PlayerInfo(props) {
  document.title = originalTitle;
  if (props.loading) return <div className="spinner" />;
  if (!props.title && !props.artist) return;
  document.title = `${props.title} by ${props.artist}`;
  const searchQuery = encodeURIComponent(`${props.artist} ${props.title}`);
  const searchLink = `https://soundcloud.com/search/sounds?q=${searchQuery}`;

  return (
    <div className="PlayerInfo">
      <a href={ searchLink } target="_blank">
        <span className="PlayerInfo_artist">{ props.artist }</span>
        <span className="PlayerInfo_title">
          { props.title }&nbsp;<Svg src={ exitUp } />
        </span>
      </a>
    </div>
  );
};
