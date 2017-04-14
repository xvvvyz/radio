import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default function PlayerArt(props) {
  return <img className="PlayerArt" src={ props.cover } />;
};
