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

  renderButtonStyle() {
    if (this.props.image) {
      return { backgroundImage: `url("${this.props.image}")` };
    }
  }

  render() {
    return (
      <li className="Tag">
        <button onClick={ this.onClick } style={ this.renderButtonStyle() }>
          <span className={ this.props.image && 'has-image' }>
            { this.props.value }
          </span>
        </button>
      </li>
    );
  }
}
