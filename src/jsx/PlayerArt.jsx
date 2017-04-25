import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default function PlayerArt(props) {
  const style = { backgroundImage: `url(${props.cover})` };
  return <div className="PlayerArt" style={ style }></div>;
};
