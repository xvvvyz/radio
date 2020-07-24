import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import store from 'store';
import './Tip.scss';

export default class Tip extends React.PureComponent {
  static propTypes = {
    alignRight: PropTypes.bool,
    bottom: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    dark: PropTypes.bool,
    disabled: PropTypes.bool,
    left: PropTypes.bool,
    noMargin: PropTypes.bool,
    text: PropTypes.string.isRequired,
  };

  state = {
    visible: false,
  };

  componentDidMount() {
    this.setState({ visible: !store.get(this.props.text) });
  }

  hideTip = () => {
    store.set(this.props.text, true);
    this.setState({ visible: false });
  };

  render() {
    const {
      alignRight,
      bottom,
      children,
      className,
      dark,
      disabled,
      left,
      noMargin,
      text,
    } = this.props;

    const { visible } = this.state;

    return (
      <div
        className={cn({
          Tip: true,
          [className]: !!className,
        })}
        onClick={this.hideTip}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => (e.keyCode === 32 ? this.hideTip() : () => {})}
      >
        <span
          className={cn({
            Tip_text: true,
            align_right: alignRight,
            bottom: bottom,
            dark: dark,
            left: left,
            no_margin: noMargin,
            visible: visible && !disabled,
          })}
        >
          {text}
        </span>
        {children}
      </div>
    );
  }
}
