import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default function PlayerArt(props) {
  return (
    <div className="PlayerArt">
      <img src={ props.cover } />
    </div>
  );
};
