import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerInfo.scss';

const originalTitle = document.title;

export default function PlayerInfo(props) {
  document.title = originalTitle;
  if (props.loading) return <div className="spinner" />;
  if (!props.title && !props.artist) return;
  document.title = `${props.title} by ${props.artist}`;

  return (
    <div className="PlayerInfo">
      <span className="PlayerInfo_artist">{ props.artist }</span>
      <span className="PlayerInfo_title">{ props.title }</span>
    </div>
  );
};
