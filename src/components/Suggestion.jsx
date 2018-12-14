import PropTypes from 'prop-types';
import React from 'react';
import { callGa } from '../utilities/helpers';

export default class Suggestion extends React.PureComponent {
  static propTypes = {
    addTags: PropTypes.func.isRequired,
    playerVisible: PropTypes.bool.isRequired,
    suggestion: PropTypes.array.isRequired,
  };

  getSuggestionText = () => {
    return this.props.suggestion.join(' + ');
  };

  handleSuggestionClick = () => {
    const { addTags, suggestion } = this.props;
    callGa('send', 'event', 'suggestion', 'click', this.getSuggestionText());
    addTags([...suggestion]);
  };

  render() {
    const { suggestion } = this.props;

    return (
      !!suggestion.length && (
        <button onClick={this.handleSuggestionClick}>
          {this.getSuggestionText()}
        </button>
      )
    );
  }
}
