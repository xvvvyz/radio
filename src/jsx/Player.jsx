import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import shader from 'shader';
import PlayerArt from './PlayerArt.jsx';
import PlayerControls from './PlayerControls.jsx';
import PlayerInfo from './PlayerInfo.jsx';
import Svg from './svg.jsx';
import '../scss/Player.scss';

export default class Player extends Component {
  constructor() {
    super();
    this.state = { isPlaying: false, isFullscreen: false };
    this.player = {};
    this.refresh = this.refresh.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.updateMediaSession = this.updateMediaSession.bind(this);
  }

  componentDidMount() {
    this.player.onplay = this.updateMediaSession;
    this.player.onplaying = () => this.setState({ isPlaying: true });
    this.player.onwaiting = () => this.setState({ isPlaying: true });
    this.player.onpause = () => this.setState({ isPlaying: false });
    this.player.onended = this.next;
  }

  componentDidUpdate() {
    this.player.muted = this.props.trackLoading;
  }

  toggleFullscreen() {
    this.setState({ isFullscreen: !this.state.isFullscreen });
  }

  refresh() {
    this.props.refresh();
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  next() {
    this.props.next();
  }

  updateMediaSession() {
    if ('mediaSession' in navigator) {
      const ms = navigator.mediaSession;

      const getCoverSizes = sizes => {
        return sizes.map(size => {
          return {
            src: this.props.getCover(size),
            sizes: `${size}x${size}`,
            type: 'image/jpeg',
          };
        })
      }

      ms.metadata = new MediaMetadata({
        title: this.props.track.name,
        artist: this.props.track.performer,
        album: this.props.track.release_name,
        artwork: getCoverSizes([96, 128, 192, 256, 384, 512]),
      });

      ms.setActionHandler('seekbackward', this.props.refresh);
      ms.setActionHandler('nexttrack', this.props.next);
    }
  }

  renderPlayerArt() {
    return <PlayerArt
      loading={ this.props.playlistLoading }
      cover={ this.props.getCover() }
    />;
  }

  renderAudio() {
    return <audio
      ref={ player => this.player = player }
      src={ this.props.track.track_file_stream_url }
      title={ `${this.props.track.name} by ${this.props.track.performer}` }
      autoplay
    />;
  }

  renderPlayerInfo() {
    if (this.props.trackLoading) {
      return <div className="spinner" />;
    } else {
      return <PlayerInfo
        title={ this.props.track.name }
        artist={ this.props.track.performer }
      />;
    }
  }

  renderPlayerControls() {
    return <PlayerControls
      refresh={ this.refresh }
      play={ this.play }
      skip={ this.next }
      pause={ this.pause }
      toggleFullscreen={ this.toggleFullscreen }
      isFullscreen={ this.state.isFullscreen }
      isPlaying={ this.state.isPlaying }
    />;
  }

  renderStyle() {
    const color = this.props.playlist.color || '#fff';
    const colorLighter = shader(shader(color, .9), -.1);
    const colorDarker = shader(color, -.4);

    return {
      backgroundColor: colorLighter,
      color: colorDarker,
      fill: colorDarker,
      stroke: colorDarker,
      borderColor: colorDarker,
    };
  }

  render() {
    const className = classNames({
      Player: true,
      fullscreen: this.state.isFullscreen,
      visible: this.props.visible,
    });

    return (
      <div className={ className } style={ this.renderStyle() }>
        <div className="Player-inner">
          { this.renderPlayerArt() }
          { this.renderAudio() }
          { this.renderPlayerInfo() }
          { this.renderPlayerControls() }
        </div>
      </div>
    );
  }
}
