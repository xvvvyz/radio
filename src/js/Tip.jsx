import preact from 'preact';
import cn from 'classnames';
import store from 'store';
import { STORE } from './utilities/constants';
import styles from '../scss/Tip.scss';

export default class Tip extends preact.Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    const { text } = this.props;
    this.setState({ visible: !store.get(text) });
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
    )
  }
}
