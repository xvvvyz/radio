import preact from 'preact';
import Tip from './Tip';
import expandSvg from '../svg/expand.svg';
import minimizeSvg from '../svg/minimize.svg';
import nextSvg from '../svg/next.svg';
import pauseSvg from '../svg/pause.svg';
import playSvg from '../svg/play.svg';
import refreshSvg from '../svg/refresh.svg';
import '../scss/PlayerControls.scss';

export default props => (
  <div className="PlayerControls" style={props.style}>
    <Tip disabled={!props.isFullscreen} noMargin text="Refresh">
      <button onClick={props.refresh}>
        <img src={refreshSvg} />
      </button>
    </Tip>
    <Tip disabled={!props.isFullscreen} noMargin text="Play/Pause">
      <button onClick={props.isPlaying ? props.pause : props.play}>
        <img src={props.isPlaying ? pauseSvg : playSvg} />
      </button>
    </Tip>
    <Tip disabled={!props.isFullscreen} noMargin text="Skip">
      <button onClick={props.skip}>
        <img src={nextSvg} />
      </button>
    </Tip>
    <Tip
      className="hide_on_desktop"
      disabled={!props.isFullscreen}
      noMargin
      text="Minimize"
    >
      <button onClick={props.toggleFullscreen}>
        <img src={props.isFullscreen ? minimizeSvg : expandSvg} />
      </button>
    </Tip>
  </div>
);
