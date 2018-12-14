import PropTypes from 'prop-types';
import React from 'react';

export default class ClickOutside extends React.PureComponent {
  static propTypes = {
    onClickOutside: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.props.onClickOutside();
    }
  };

  render() {
    return <div ref={node => (this.wrapper = node)}>{this.props.children}</div>;
  }
}
