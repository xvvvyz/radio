import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import shader from 'shader';
import PlayerArt from './PlayerArt.jsx';
import PlayerControls from './PlayerControls.jsx';
import PlayerInfo from './PlayerInfo.jsx';
import Svg from './svg.jsx';
import loadingSvg from '../svg/loading.svg';
import '../scss/Player.scss';

export default class Player extends Component {
  constructor() {
    super();
    this.state = { playing: false, fullscreen: false };
    this.player = {};
    this.refresh = this.refresh.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.player.onplay = () => this.setState({ playing: true });
    this.player.onended = this.next;
  }

  toggle() {
    this.setState({ fullscreen: !this.state.fullscreen });
  }

  refresh() {
    this.player.pause();
    this.props.refresh();
  }

  play() {
    this.setState({ playing: true });
    this.player.play();
  }

  pause() {
    this.setState({ playing: false });
    this.player.pause();
  }

  next() {
    this.player.pause();
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
      src={ this.props.track.track_file_stream_url || null }
      title={ `${this.props.track.name || null} by ${this.props.track.performer || null}` }
      autoplay
    />;
  }

  renderPlayerInfo() {
    if (this.props.trackLoading) {
      return <Svg className="track-loading" src={ loadingSvg } />;
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
      skip={ this.next }
      play={ this.play }
      pause={ this.pause }
      toggle={ this.toggle }
      playing={ this.state.playing }
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
      fullscreen: this.state.fullscreen,
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
