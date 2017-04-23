import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerInfo.scss';

export default function PlayerInfo(props) {
  document.title = `${props.title} by ${props.artist}`;

  return (
    <div className="PlayerInfo fade_in">
      <span className="PlayerInfo_artist">{ props.artist }</span>
      <span className="PlayerInfo_title">{ props.title }</span>
    </div>
  );
};
