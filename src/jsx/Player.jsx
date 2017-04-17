import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import shader from 'shader';
import PlayerArt from './PlayerArt.jsx';
import PlayerControls from './PlayerControls.jsx';
import PlayerInfo from './PlayerInfo.jsx';
import '../scss/Player.scss';

export default class Player extends Component {
  constructor() {
    super();
    this.state = { playing: false, toggled: false };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.skip = this.skip.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidUpdate() {
    if (this.props.track.id) {
      this.player.onplay = () => this.setState({ playing: true });
      this.player.onpause = () => this.setState({ playing: false });
      this.player.onended = this.next;
    }
  }

  toggle() {
    this.setState({ toggled: !this.state.toggled });
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

  skip() {
    this.props.skip();
  }

  renderAudio() {
    return <audio
      ref={ player => this.player = player }
      src={this.props.track.track_file_stream_url}
      autoplay="true"
    />;
  }

  renderPlayerArt() {
    const playlist = this.props.playlist;
    const cover = playlist ? playlist.cover : '';
    return <PlayerArt cover={ cover } />;
  }

  renderPlayerInfo() {
    const title = this.props.track ? this.props.track.name : '';
    const artist = this.props.track ? this.props.track.performer : '';
    return <PlayerInfo title={ title } artist={ artist } />;
  }

  renderPlayerControls(color) {
    return <PlayerControls
      style={ { borderColor: color } }
      refresh={ this.props.refresh }
      skip={ this.skip }
      play={ this.play }
      pause={ this.pause }
      toggle={ this.toggle }
      playing={ this.state.playing }
      toggled={ this.state.toggled }
    />;
  }

  render() {
    const color = this.props.playlist.color;
    const colorLighter = shader(shader(color, .85), -.1);
    const colorDarker = shader(color, -.4);

    const style = {
      backgroundColor: colorLighter,
      color: colorDarker,
      fill: colorDarker,
      borderColor: colorDarker,
    };

    const className = classNames({
      Player: true,
      toggled: this.state.toggled,
    });

    return (
      <div className={ className } style={ style }>
        <div className="Player-inner">
          { this.renderAudio() }
          { this.renderPlayerArt() }
          { this.renderPlayerInfo() }
          { this.renderPlayerControls(colorDarker) }
        </div>
      </div>
    );
  }
}
