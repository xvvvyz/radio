import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/Tag.scss';

export default class Tag extends Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.value);
  }

  render() {
    return (
      <li className="Tag">
        <button onClick={ this.onClick }>
          { this.props.value }
        </button>
      </li>
    );
  }
}
