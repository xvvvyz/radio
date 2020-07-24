import PropTypes from 'prop-types';
import React from 'react';
import List from './List';
import api from '../utilities/api';
import './Search.scss';

const PLACEHOLDER = 'Search for an artist, genre, activity or mood';

export default class Search extends React.PureComponent {
  static propTypes = {
    addTags: PropTypes.func.isRequired,
  };

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

  onChange = async (event) => {
    const value = event.target.value;
    if (value === this.state.value) return;
    this.setState({ value });

    if (!value) {
      this.setState({ tags: [] });
      return;
    }

    const tags = await api.search(value);
    if (!this.state.value) return;

    this.setState({ tags });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    await this.props.addTags(this.state.value);
    this.setState({ tags: [], value: '' });
  };

  render() {
    return (
      <form className="Search" onSubmit={this.onSubmit}>
        <input
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          placeholder={this.state.placeholder}
          type="text"
          value={this.state.value}
        />
        <List addTags={this.props.addTags} fullWidth items={this.state.tags} />
      </form>
    );
  }
}
