import preact from 'preact';
import List from './List';
import api from './utilities/api';
import '../scss/Search.scss';

const PLACEHOLDER = 'Search for an artist, genre, activity or mood';

export default class Search extends preact.Component {
  state = {
    placeholder: PLACEHOLDER,
    tags: [],
    value: '',
  };

  onBlur = () => {
    this.setState({ placeholder: PLACEHOLDER });
  };

  onFocus = () => {
    this.setState({ placeholder: '' });
  };

  onInput = async event => {
    const value = event.target.value;
    if (value === this.state.value) return;
    this.setState({ value });

    if (!value) {
      this.setState({ tags: [] });
      return;
    }

    const tags = await api.search(value);
    if (!this.state.value) return;
    ga('send', 'event', 'search', 'search', value);

    this.setState({ tags });
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
