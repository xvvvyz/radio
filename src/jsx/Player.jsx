import Inferno from 'inferno';
import Component from 'inferno-component';
import { Howl } from 'howler';
import shader from 'shader';
import PlayerArt from './PlayerArt.jsx';
import PlayerInfo from './PlayerInfo.jsx';
import Controls from './Controls.jsx';
import eight from './utilities/eighttracks.js';
import '../scss/Player.scss';

export default class Player extends Component {
  playUrl(url) {

  }

  fetchNextSong() {
    eight.nextSong({ mix_id: this.props.playlist.id }).then(json => {
      this.playUrl(json.set.track.track_file_stream_url);
      this.setState({ track: json.set.track })
    });
  }

  renderPlayerArt() {
    const playlist = this.props.playlist;
    const title = playlist ? playlist.name : '';
    const cover = playlist ? playlist.cover_urls.sq500 : '';
    return <PlayerArt title={ title } cover={ cover } />;
  }

  renderPlayerInfo() {
    const title = this.state.track ? this.state.track.name : '';
    const artist = this.state.track ? this.state.track.performer : '';
    return <PlayerInfo title={ title } artist={ artist } />;
  }

  render() {
    const color = this.props.playlist.color_palette[0];
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
        { this.renderPlayerArt() }
        { this.renderPlayerInfo() }
        <Controls />
      </aside>
    );
  }
}
