import PropTypes from 'prop-types';
import React from 'react';
import Suggestion from './Suggestion';
import './Suggestions.scss';

export default class Suggestions extends React.PureComponent {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
  };

  render() {
    const { suggestions, ...rest } = this.props;

    return !!suggestions.length && (
      <div className="Suggestions">
        {suggestions.slice(0, 3).map((suggestion, i) =>
          <Suggestion {...rest} key={i} suggestion={suggestion} />)}
      </div>
    );
  }
}
