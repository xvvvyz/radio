import Inferno from 'inferno';
import Component from 'inferno-component';
import Tag from './Tag.jsx';
import '../scss/List.scss';

export default class List extends Component {
  render() {
    const items = this.props.items.map(item => {
      const isObj = typeof item === 'object';

      return <Tag
        value={ isObj ? item.name : item }
        image={ isObj ? item.artist_avatar : null }
        onClick={ this.props.addTag }
      />;
    });

    return (
      <div className="List">
        <h3>{ this.props.title }</h3>
        <ul>{ items }</ul>
      </div>
    );
  }
}
