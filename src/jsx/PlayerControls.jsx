import Inferno from 'inferno';
import Component from 'inferno-component';
import Svg from './svg.jsx';
import '../scss/PlayerControls.scss';
import pauseSvg from '../svg/pause.svg';
import playSvg from '../svg/play.svg';
import refreshSvg from '../svg/refresh.svg';
import skipSvg from '../svg/skip.svg';

export default function PlayerControls(props) {
  const refreshButton = (
    <button onClick={ props.refresh }>
      <Svg src={ refreshSvg } />
    </button>
  );

  const playPauseButton = (
    <button onClick={ props.playing ? props.pause : props.play }>
      <Svg src={ props.playing ? pauseSvg : playSvg } />
    </button>
  );

  const skipButton = (
    <button onClick={ props.next }>
      <Svg src={ skipSvg } />
    </button>
  );

  return (
    <div className="PlayerControls" style={ props.style }>
      { refreshButton }{ playPauseButton }{ skipButton }
    </div>
  );
};
