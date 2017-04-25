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
  const playMethod = props.isPlaying ? props.pause : props.play;
  const playSvg = props.isPlaying ? pauseSvg : playSvg;
  const fullscreenSvg = props.isFullscreen ? minimizeSvg : expandSvg;

  return (
    <div className="PlayerControls" style={ props.style }>
      <button onClick={ props.refresh }>
        <Svg src={ refreshSvg } />
      </button>
      <button onClick={ playMethod }>
        <Svg src={ playSvg } />
      </button>
      <button onClick={ props.skip }>
        <Svg src={ nextSvg } />
      </button>
      <button onClick={ props.toggleFullscreen }>
        <Svg src={ fullscreenSvg } />
      </button>
    </div>
  );
};
