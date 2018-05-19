import preact from 'preact';
import List from './List';
import api from './utilities/api';
import '../scss/Search.scss';

const PLACEHOLDER = 'Search for an artist, genre, activity or mood';

export default class Search extends preact.Component {
  state = {
    placeholder: PLACEHOLDER,
    tags: [],
  };

  onBlur = () => {
    this.setState({ placeholder: PLACEHOLDER });
  };

  onFocus = () => {
    this.setState({ placeholder: '' });
  };

  onInput = ({ target }) => {
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
  };

  render() {
    return (
      <section className="Search">
        <input
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onInput={this.onInput}
          placeholder={this.state.placeholder}
          type="text"
        />
        <List
          addTags={this.props.addTags}
          fullWidth
          items={this.state.tags}
        />
      </section>
    );
  }
}
