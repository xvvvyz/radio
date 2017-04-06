import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/Lists.scss';

export default class Lists extends Component {
  render() {
    return <section className="Lists">{ this.props.children }</section>;
  }
}
