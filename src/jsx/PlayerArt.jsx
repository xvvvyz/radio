import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/PlayerArt.scss';

export default class PlayerArt extends Component {
  render() {
    return <img className="PlayerArt" src={ this.props.cover } />;
  }
}
