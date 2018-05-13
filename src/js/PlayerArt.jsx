import preact from 'preact';
import '../scss/PlayerArt.scss';

export default props => (
  <div className="PlayerArt">
    <div
      className="PlayerArt_background"
      style={{ backgroundImage: `url(${props.cover})` }}
    />
    <img
      className="PlayerArt_image"
      src={props.cover}
    />
  </div>
);
