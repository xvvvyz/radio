import preact from 'preact';
import expandSvg from '../svg/expand.svg';
import minimizeSvg from '../svg/minimize.svg';
import nextSvg from '../svg/next.svg';
import pauseSvg from '../svg/pause.svg';
import playSvg from '../svg/play.svg';
import refreshSvg from '../svg/refresh.svg';
import '../scss/PlayerControls.scss';

export default props => (
  <div className="PlayerControls" style={props.style}>
    <button onClick={props.refresh}>
      <img src={refreshSvg} />
    </button>
    <button onClick={props.isPlaying ? props.pause : props.play}>
      <img src={props.isPlaying ? pauseSvg : playSvg} />
    </button>
    <button onClick={props.skip}>
      <img src={nextSvg} />
    </button>
    <button onClick={props.toggleFullscreen}>
      <img src={props.isFullscreen ? minimizeSvg : expandSvg} />
    </button>
  </div>
);
