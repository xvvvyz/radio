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
    this.state = { playing: false };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.skip = this.skip.bind(this);
  }

  componentDidUpdate() {
    if (this.props.track.id) {
      this.player.onplay = () => this.setState({ playing: true });
      this.player.onpause = () => this.setState({ playing: false });
      this.player.onended = this.next;
    }
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
      playing={ this.state.playing }
    />;
  }

  render() {
    const color = this.props.playlist.color;
    const colorDarker = shader(color, -.3);
    const colorLighter = shader(color, .8);

    const style = {
      backgroundColor: colorDarker,
      color: colorLighter,
      fill: colorLighter,
      borderColor: colorLighter,
    }

    return (
      <aside className="Player" style={ style }>
        { this.renderAudio() }
        { this.renderPlayerArt() }
        { this.renderPlayerInfo() }
        { this.renderPlayerControls(colorLighter) }
      </aside>
    );
  }
}
