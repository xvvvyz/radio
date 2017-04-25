import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default function PlayerArt(props) {
  const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAA' +
    'C1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

  const className = classNames({
    PlayerArt: true,
    loading: props.loading,
  });

  return (
    <div className={ className }>
      <img src={ props.cover ? props.cover : pixel } />
    </div>
  );
};
