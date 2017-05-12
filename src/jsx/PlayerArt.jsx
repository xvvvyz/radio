import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default function PlayerArt(props) {
  const background = props.cover ? props.cover : '';
  const style = { backgroundImage: `url(${background})` };

  return (
    <div className="PlayerArt">
      <div className="PlayerArt_background" style={ style }></div>
      <img className="PlayerArt_image" src={ background } />
    </div>
  );
};
