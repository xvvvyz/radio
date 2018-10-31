import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import './PlayerArt.scss';

export default class PlayerArt extends React.PureComponent {
  static propTypes = {
    cover: PropTypes.string,
  };

  state = {
    isLoading: true,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { cover } = this.props;

    if (cover && prevProps.cover !== cover) {
      this.setState({ isLoading: true });
    }
  }

  onLoad = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { cover } = this.props;
    const { isLoading } = this.state;

    return (
      <div className={cn({ PlayerArt: true, loaded: !isLoading })}>
        {!!cover && <div
          className="PlayerArt_background"
          style={{ backgroundImage: `url(${cover})` }}
        />}
        {!!cover && <img
          alt=""
          className="PlayerArt_image"
          onLoad={this.onLoad}
          src={cover}
        />}
      </div>
    );
  }
}
