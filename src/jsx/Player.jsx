import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import PlayerArt from './PlayerArt.jsx';
import PlayerControls from './PlayerControls.jsx';
import PlayerInfo from './PlayerInfo.jsx';
import Svg from './Svg.jsx';
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
    this.skip = this.skip.bind(this);
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
    ga('send', 'event', 'player', 'refresh');
    this.props.refresh();
  }

  play() {
    ga('send', 'event', 'player', 'play');
    this.player.play();
  }

  pause() {
    ga('send', 'event', 'player', 'pause');
    this.player.pause();
  }

  next() {
    ga('send', 'event', 'player', 'next');
    this.props.next();
  }

  skip() {
    ga('send', 'event', 'player', 'skip');
    this.props.skip();
  }

  updateMediaSession() {
    if ('mediaSession' in navigator) {
      const ms = navigator.mediaSession;

      const getCoverSizes = sizes => {
        return sizes.map(size => {
          return {
            src: this.props.getCoverSize(size),
            sizes: `${size}x${size}`,
            type: 'image/jpeg',
          };
        })
      }

      ms.metadata = new MediaMetadata({
        title: this.props.track.title,
        artist: this.props.track.artist,
        album: this.props.track.album,
        artwork: getCoverSizes([96, 128, 192, 256, 384, 512]),
      });

      ms.setActionHandler('seekbackward', this.props.refresh);
      ms.setActionHandler('nexttrack', this.props.skip);
    }
  }

  render() {
    const className = classNames({
      Player: true,
      fullscreen: this.state.isFullscreen,
      visible: this.props.visible,
    });

    return (
      <div className={ className }>
        <div className="Player_inner">
          <PlayerArt
            cover={ this.props.getCoverSize() }
          />
          <audio
            ref={ player => this.player = player }
            src={ this.props.track.stream }
            title={ `${this.props.track.title} by ${this.props.track.artist}` }
            autoplay
          />
          <PlayerInfo
            title={ this.props.track.title }
            artist={ this.props.track.artist }
            loading={ this.props.trackLoading }
          />
          <PlayerControls
            refresh={ this.refresh }
            play={ this.play }
            skip={ this.skip }
            pause={ this.pause }
            toggleFullscreen={ this.toggleFullscreen }
            isFullscreen={ this.state.isFullscreen }
            isPlaying={ this.state.isPlaying }
          />
        </div>
      </div>
    );
  }
}
