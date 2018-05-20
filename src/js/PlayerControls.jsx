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
    <Tip disabled={!props.isFullscreen} noMargin text="Fresh Playlist">
      <button disabled={props.disabled} onClick={props.refresh}>
        <img src={refreshSvg} />
      </button>
    </Tip>
    <button
      disabled={props.disabled}
      onClick={props.isPlaying ? props.pause : props.play}
    >
      <img src={props.isPlaying ? pauseSvg : playSvg} />
    </button>
    <Tip disabled={!props.isFullscreen} noMargin text="Skip Song">
      <button disabled={props.disabled} onClick={props.skip}>
        <img src={nextSvg} />
      </button>
    </Tip>
    <button className="hide_on_desktop" onClick={props.toggleFullscreen}>
      <img src={props.isFullscreen ? minimizeSvg : expandSvg} />
    </button>
  </div>
);
