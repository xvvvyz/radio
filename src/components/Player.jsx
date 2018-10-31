import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import debounce from 'lodash/debounce';
import store from 'store';
import PlayerArt from './PlayerArt';
import PlayerControls from './PlayerControls';
import PlayerInfo from './PlayerInfo';
import { callGa } from './utilities/helpers';
import './Player.scss';

export default class Player extends React.PureComponent {
  static propTypes = {
    deadEnd: PropTypes.bool.isRequired,
    track: PropTypes.object,
    trackLoading: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  state = {
    isFullscreen: true,
    isPlaying: false,
    volume: store.get('volume') || 1,
    volumeVisible: false,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.player) return;
    this.player.muted = this.props.trackLoading;
    this.player.onended = this.next;
    this.player.onpause = () => this.setState({ isPlaying: false });
    this.player.onplay = this.updateMediaSession;
    this.player.onplaying = () => this.setState({ isPlaying: true });
    this.player.onwaiting = () => this.setState({ isPlaying: true });
    this.player.volume = this.state.volume;
  }

  getCoverSize = (size = 512) => {
    if (!this.props.playlist) return null;
    return this.props.playlist.cover + `&w=${size}&h=${size}`;
  };

  handleVolume = volume => {
    this.setState({ volume });
    debounce((() => store.set('volume', volume)), 2000);
  };

  toggleFullscreen = () => {
    this.setState({
      isFullscreen: !this.state.isFullscreen,
      volumeVisible: this.state.isFullscreen ? false : this.state.volumeVisible,
    });
  };

  toggleVolume = () => {
    this.setState({
      isFullscreen: true,
      volumeVisible: !this.state.volumeVisible,
    });
  };

  refresh = () => {
    callGa('send', 'event', 'player', 'refresh');
    this.props.refresh();
  };

  play = () => {
    callGa('send', 'event', 'player', 'play');
    this.player.play();
  };

  pause = () => {
    callGa('send', 'event', 'player', 'pause');
    this.player.pause();
  };

  next = () => {
    callGa('send', 'event', 'player', 'next');
    this.props.next();
  };

  skip = () => {
    callGa('send', 'event', 'player', 'skip');
    this.props.skip();
  };

  updateMediaSession = () => {
    if ('mediaSession' in navigator) {
      const ms = navigator.mediaSession;

      const getCoverSizes = sizes => sizes.map(size => ({
        sizes: `${size}x${size}`,
        src: this.getCoverSize(size),
        type: 'image/jpeg',
      }));

      // eslint-disable-next-line no-undef
      ms.metadata = new MediaMetadata({
        album: this.props.track.album,
        artist: this.props.track.artist,
        artwork: getCoverSizes([96, 128, 192, 256, 384, 512]),
        title: this.props.track.title,
      });

      ms.setActionHandler('nexttrack', this.props.skip);
    }
  };

  render() {
    const { deadEnd, track, trackLoading, visible } = this.props;
    const { isFullscreen, isPlaying } = this.state;

    return (
      <div
        className={cn({
          Player: true,
          fullscreen: isFullscreen,
          visible: visible,
        })}
      >
        <div className="Player_inner">
          <PlayerArt cover={this.getCoverSize()} />
          {track && <audio
            autoPlay={true}
            ref={player => this.player = player}
            src={track.stream}
            title={`${track.title} by ${track.artist}`}
          />}
          {!!deadEnd && !trackLoading && <div className="Player_error">
            No "{deadEnd}" playlists found.
          </div>}
          <PlayerInfo loading={trackLoading} track={track} />
          <PlayerControls
            disabled={!track}
            handleVolume={this.handleVolume}
            isFullscreen={isFullscreen}
            isPlaying={isPlaying}
            pause={this.pause}
            play={this.play}
            refresh={this.refresh}
            skip={this.skip}
            toggleFullscreen={this.toggleFullscreen}
            toggleVolume={this.toggleVolume}
            volume={Number(this.state.volume)}
            volumeVisible={this.state.volumeVisible}
          />
        </div>
      </div>
    );
  }
}
