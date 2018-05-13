import preact from 'preact';
import cn from 'classnames';
import PlayerArt from './PlayerArt.jsx';
import PlayerControls from './PlayerControls.jsx';
import PlayerInfo from './PlayerInfo.jsx';
import '../scss/Player.scss';

export default class Player extends preact.Component {
  state = {
    isFullscreen: false,
    isPlaying: false,
  };

  componentDidMount() {
    this.player.onended = this.next;
    this.player.onpause = () => this.setState({ isPlaying: false });
    this.player.onplay = this.updateMediaSession;
    this.player.onplaying = () => this.setState({ isPlaying: true });
    this.player.onwaiting = () => this.setState({ isPlaying: true });
  }

  componentDidUpdate() {
    this.player.muted = this.props.trackLoading;
  }

  toggleFullscreen = () => {
    this.setState({ isFullscreen: !this.state.isFullscreen });
  };

  refresh = () => {
    ga('send', 'event', 'player', 'refresh');
    this.props.refresh();
  };

  play = () => {
    ga('send', 'event', 'player', 'play');
    this.player.play();
  };

  pause = () => {
    ga('send', 'event', 'player', 'pause');
    this.player.pause();
  };

  next = () => {
    ga('send', 'event', 'player', 'next');
    this.props.next();
  };

  skip = () => {
    ga('send', 'event', 'player', 'skip');
    this.props.skip();
  };

  updateMediaSession = () => {
    if ('mediaSession' in navigator) {
      const ms = navigator.mediaSession;

      const getCoverSizes = sizes => sizes.map(size => ({
        sizes: `${size}x${size}`,
        src: this.props.getCoverSize(size),
        type: 'image/jpeg',
      }));

      ms.metadata = new MediaMetadata({
        album: this.props.track.album,
        artist: this.props.track.artist,
        artwork: getCoverSizes([96, 128, 192, 256, 384, 512]),
        title: this.props.track.title,
      });

      ms.setActionHandler('seekbackward', this.props.refresh);
      ms.setActionHandler('nexttrack', this.props.skip);
    }
  };

  render() {
    return (
      <div
        className={cn({
          Player: true,
          fullscreen: this.state.isFullscreen,
          visible: this.props.visible,
      })}>
        <div className="Player_inner">
          <PlayerArt
            cover={this.props.getCoverSize()}
          />
          <audio
            autoPlay={true}
            ref={player => this.player = player}
            src={this.props.track.stream}
            title={`${this.props.track.title} by ${this.props.track.artist}`}
          />
          <PlayerInfo
            artist={this.props.track.artist}
            loading={this.props.trackLoading}
            title={this.props.track.title}
          />
          <PlayerControls
            isFullscreen={this.state.isFullscreen}
            isPlaying={this.state.isPlaying}
            pause={this.pause}
            play={this.play}
            refresh={this.refresh}
            skip={this.skip}
            toggleFullscreen={this.toggleFullscreen}
          />
        </div>
      </div>
    );
  }
}
