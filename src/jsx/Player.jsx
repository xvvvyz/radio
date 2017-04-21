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
  }

  componentDidMount() {
    this.player.onplaying = () => this.setState({ isPlaying: true });
    this.player.onpause = () => this.setState({ isPlaying: false });
    this.player.onwaiting = this.player.onplaying;
    this.player.onended = this.next;
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

  renderPlayerArt() {
    return <PlayerArt
      loading={ this.props.playlistLoading }
      cover={ this.props.playlist.cover }
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
