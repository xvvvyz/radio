import Inferno from 'inferno';
import Component from 'inferno-component';
import Tag from './Tag.jsx';
import '../scss/CurrentTags.scss';

export default class CurrentTags extends Component {
  render() {
    const tags = this.props.currentTags;

    return (
      <ul className="CurrentTags">
        { tags[0] && <Tag
          onClick={ this.props.removeTag }
          value={ tags[0] }
        /> }

        { tags[1] && <li className="divider">+</li> }

        { tags[1] && <Tag
          onClick={ this.props.removeTag }
          value={ tags[1] }
        /> }
      </ul>
    );
  }
}
