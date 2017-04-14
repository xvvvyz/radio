import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerInfo.scss';

export default function PlayerInfo(props) {
  document.title = `${props.title} by ${props.artist}`;

  return (
    <div className="PlayerInfo">
      <span className="PlayerInfo-title">{ props.title }</span>
      <span className="PlayerInfo-artist">{ props.artist }</span>
    </div>
  );
};
