import preact from 'preact';
import cn from 'classnames';
import ClickOutside from './ClickOutside';
import Tip from './Tip';
import expandSvg from '../svg/expand.svg';
import minimizeSvg from '../svg/minimize.svg';
import nextSvg from '../svg/next.svg';
import pauseSvg from '../svg/pause.svg';
import playSvg from '../svg/play.svg';
import refreshSvg from '../svg/refresh.svg';
import volume0Svg from '../svg/volume-x.svg';
import volume1Svg from '../svg/volume-1.svg';
import volume2Svg from '../svg/volume-2.svg';
import '../scss/PlayerControls.scss';

export default props => (
  <div className="PlayerControls" style={props.style}>
    <div
      className={cn({
        PlayerControls_volume: true,
        visible: props.volumeVisible,
      })}
    >
      <ClickOutside
        onClickOutside={props.volumeVisible ? props.toggleVolume : () => {}}
      >
        <input
          max={1}
          min={0}
          onChange={props.handleVolume}
          onInput={props.handleVolume}
          step={.01}
          type="range"
          value={props.volume}
        />
        <button onClick={props.toggleVolume}>
          <img
            src={props.volume < .01 ?
              volume0Svg
              : (props.volume < .50
                ? volume1Svg
                : volume2Svg)}
          />
        </button>
      </ClickOutside>
    </div>
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
