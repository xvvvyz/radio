import Inferno from 'inferno';
import Component from 'inferno-component';
import Svg from './svg.jsx';
import '../scss/PlayerControls.scss';
import expandSvg from '../svg/expand.svg';
import minimizeSvg from '../svg/minimize.svg';
import nextSvg from '../svg/next.svg';
import pauseSvg from '../svg/pause.svg';
import playSvg from '../svg/play.svg';
import refreshSvg from '../svg/refresh.svg';

export default function PlayerControls(props) {
  const refreshButton = (
    <button className="PlayerControls-refresh" onClick={ props.refresh }>
      <Svg src={ refreshSvg } />
    </button>
  );

  const playPauseButton = (
    <button onClick={ props.isPlaying ? props.pause : props.play }>
      <Svg src={ props.isPlaying ? pauseSvg : playSvg } />
    </button>
  );

  const skipButton = (
    <button onClick={ props.skip }>
      <Svg src={ nextSvg } />
    </button>
  );

  const toggleButton = (
    <button className="PlayerControls-toggle" onClick={ props.toggleFullscreen }>
      <Svg src={ props.isFullscreen ? minimizeSvg : expandSvg } />
    </button>
  );

  return (
    <div className="PlayerControls" style={ props.style }>
      { refreshButton }{ playPauseButton }{ skipButton }{ toggleButton }
    </div>
  );
};
