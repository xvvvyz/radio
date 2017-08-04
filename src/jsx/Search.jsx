import Inferno from 'inferno';
import Component from 'inferno-component';
import List from './List.jsx';
import api from './utilities/api.js';
import '../scss/Search.scss';

export default class Search extends Component {
  constructor() {
    super();
    this.placeholder = 'Enter an artist, genre, activity or mood...';
    this.state = { tags: [], placeholder: this.placeholder };
    this.onFocus = this.onFocus.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    this.setState({ placeholder: this.placeholder });
  }

  onFocus() {
    this.setState({ placeholder: '' });
  }

  onInput({ target }) {
    if (target.value === this.value) return false;
    this.value = target.value;

    if (target.value) {
      ga('send', 'event', 'search', 'search', target.value);

      api.search({ q: target.value, per_page: 10 }).then(res => {
        if (this.value) this.setState({ tags: res.tag_cloud.tags });
      });
    } else {
      this.setState({ tags: [] });
    }
  }

  render() {
    return (
      <section className="Search">
        <input
          type="text"
          placeholder={ this.state.placeholder }
          onInput={ this.onInput }
          onFocus={ this.onFocus }
          onBlur={ this.onBlur }
        />
        <List
          items={ this.state.tags }
          addTags={ this.props.addTags }
          fullWidth
        />
      </section>
    );
  }
}
