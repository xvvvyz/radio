import Inferno from 'inferno';
import Component from 'inferno-component';
import Svg from './svg.jsx';
import refreshSvg from '../svg/refresh.svg';
import playSvg from '../svg/play.svg';
import pauseSvg from '../svg/pause.svg';
import skipSvg from '../svg/skip.svg';
import '../scss/Controls.scss';

export default class Controls extends Component {
  renderPlayButton() {
    return <Svg
      className="Controls-playpause"
      src={ playSvg }
    />;
  }

  render() {
    return (
      <div className="Controls">
        <Svg className="Controls-refresh" src={ refreshSvg } />
        { this.renderPlayButton() }
        <Svg className="Controls-skip" src={ skipSvg } />
      </div>
    );
  }
}
