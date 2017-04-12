import Inferno from 'inferno';
import Component from 'inferno-component';
import Svg from './svg.jsx';
import '../scss/PlayerControls.scss';
import pauseSvg from '../svg/pause.svg';
import playSvg from '../svg/play.svg';
import refreshSvg from '../svg/refresh.svg';
import skipSvg from '../svg/skip.svg';

export default class PlayerControls extends Component {
  renderRefreshButton() {
    return (
      <button onClick={ this.props.refresh }>
        <Svg src={ refreshSvg } />
      </button>
    );
  }

  renderPlayPauseButton() {
    const onClick = this.props.playing ? this.props.pause : this.props.play;
    const src = this.props.playing ? pauseSvg : playSvg;
    return <button onClick={ onClick }><Svg src={ src } /></button>;
  }

  renderSkipButton() {
    return (
      <button onClick={ this.props.next }>
        <Svg src={ skipSvg } />
      </button>
    );
  }

  render() {
    return (
      <div className="PlayerControls" style={ this.props.style }>
        { this.renderRefreshButton() }
        { this.renderPlayPauseButton() }
        { this.renderSkipButton() }
      </div>
    );
  }
}
