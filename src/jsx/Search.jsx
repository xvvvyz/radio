import Inferno from 'inferno';
import Component from 'inferno-component';
import List from './List.jsx';
import api from './utilities/api.js';
import '../scss/Search.scss';

export default class Search extends Component {
  constructor() {
    super();

    this.placeholder = 'Enter an artist, genre, activity or mood...';

    this.state = {
      tags: [],
      placeholder: this.placeholder,
    };

    this.search = this.search.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.setState({ placeholder: '' });
  }

  onBlur() {
    this.setState({ placeholder: this.placeholder });
  }

  search({ target }) {
    api.search({ q: target.value, per_page: 10 }).then(res => {
      this.setState({ tags: res.tag_cloud.tags });
    });
  }

  render() {
    return (
      <section className="Search">
        <input
          type="text"
          placeholder={ this.state.placeholder }
          onKeyup={ this.search }
          onFocus={ this.onFocus }
          onBlur={ this.onBlur }
        />
        <List
          items={ this.state.tags }
          addTag={ this.props.addTag }
        />
      </section>
    );
  }
}
