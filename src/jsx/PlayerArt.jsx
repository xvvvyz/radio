import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default function PlayerArt(props) {
  const className = classNames({
    PlayerArt: true,
    loading: props.loading,
  });

  return (
    <div className={ className }>
      <img src={ props.cover } />
    </div>
  );
};
