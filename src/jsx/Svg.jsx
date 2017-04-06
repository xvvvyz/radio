import Inferno from 'inferno';
import Component from 'inferno-component';

export default class Svg extends Component {
  render() {
    return (
      <svg className={ this.props.className }>
        <use xlink:href={ this.props.src } />
      </svg>
    );
  }
}
