import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerInfo.scss';

export default class PlayerInfo extends Component {
  render() {
    return (
      <div className="PlayerInfo">
        <span className="PlayerInfo-title">{ this.props.title }</span>
        <span className="PlayerInfo-artist">{ this.props.artist }</span>
      </div>
    );
  }
}
