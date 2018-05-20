import preact from 'preact';
import cn from 'classnames';
import '../scss/PlayerArt.scss';

export default class PlayerArt extends preact.Component {
  state = {
    isLoading: true,
  };

  componentDidUpdate(prevProps) {
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
        <div
          className="PlayerArt_background"
          style={{ backgroundImage: `url(${cover})` }}
        />
       <img className="PlayerArt_image" onLoad={this.onLoad} src={cover} />
      </div>
    );
  }
}
