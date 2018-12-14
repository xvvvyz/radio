import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import ClickOutside from './ClickOutside';
import Tip from './Tip';
import expandSvg from '../images/expand.svg';
import minimizeSvg from '../images/minimize.svg';
import nextSvg from '../images/next.svg';
import pauseSvg from '../images/pause.svg';
import playSvg from '../images/play.svg';
import refreshSvg from '../images/refresh.svg';
import volume0Svg from '../images/volume-x.svg';
import volume1Svg from '../images/volume-1.svg';
import volume2Svg from '../images/volume-2.svg';
import './PlayerControls.scss';

const PlayerControls = props => (
  <div className="PlayerControls">
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
          onChange={e => props.handleVolume(e.target.value)}
          onInput={e => props.handleVolume(e.target.value)}
          step={0.01}
          type="range"
          value={props.volume}
        />
        <button onClick={props.toggleVolume}>
          <img
            alt={`volume ${props.volume * 100}%`}
            src={
              props.volume < 0.01
                ? volume0Svg
                : props.volume < 0.5
                ? volume1Svg
                : volume2Svg
            }
          />
        </button>
      </ClickOutside>
    </div>
    <Tip disabled={!props.isFullscreen} noMargin text="Fresh Playlist">
      <button disabled={props.disabled} onClick={props.refresh}>
        <img alt="refresh" src={refreshSvg} />
      </button>
    </Tip>
    <button
      disabled={props.disabled}
      onClick={props.isPlaying ? props.pause : props.play}
    >
      <img
        alt={props.isPlaying ? 'pause' : 'play'}
        src={props.isPlaying ? pauseSvg : playSvg}
      />
    </button>
    <Tip disabled={!props.isFullscreen} noMargin text="Skip Track">
      <button disabled={props.disabled} onClick={props.skip}>
        <img alt="skip" src={nextSvg} />
      </button>
    </Tip>
    <button className="hide_on_desktop" onClick={props.toggleFullscreen}>
      <img
        alt={props.isFullscreen ? 'minimize' : 'expand'}
        src={props.isFullscreen ? minimizeSvg : expandSvg}
      />
    </button>
  </div>
);

PlayerControls.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleVolume: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  pause: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  skip: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
  toggleVolume: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  volumeVisible: PropTypes.bool.isRequired,
};

export default PlayerControls;
