import preact from 'preact';

export default class ClickOutside extends preact.Component {
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
    return <div ref={node => this.wrapper = node}>{this.props.children}</div>;
  }
}
