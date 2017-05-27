import Inferno from 'inferno';
import Component from 'inferno-component';
import Svg from './Svg.jsx';
import '../scss/PlayerControls.scss';
import expandSvg from '../svg/expand.svg';
import minimizeSvg from '../svg/minimize.svg';
import nextSvg from '../svg/next.svg';
import pauseSvg from '../svg/pause.svg';
import playSvg from '../svg/play.svg';
import refreshSvg from '../svg/refresh.svg';

export default function PlayerControls(props) {
  return (
    <div className="PlayerControls" style={ props.style }>
      <button onClick={ props.refresh }>
        <Svg src={ refreshSvg } />
      </button>
      <button onClick={ props.isPlaying ? props.pause : props.play }>
        <Svg src={ props.isPlaying ? pauseSvg : playSvg } />
      </button>
      <button onClick={ props.skip }>
        <Svg src={ nextSvg } />
      </button>
      <button onClick={ props.toggleFullscreen }>
        <Svg src={ props.isFullscreen ? minimizeSvg : expandSvg } />
      </button>
    </div>
  );
};
