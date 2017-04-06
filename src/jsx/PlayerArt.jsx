import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default class PlayerArt extends Component {
  render() {
    return <div
      className="PlayerArt"
      style={ { backgroundImage: `url("${this.props.cover}")` } }
    />;
  }
}
