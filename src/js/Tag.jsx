import preact from 'preact';
import '../scss/Tag.scss';

export default props => (
  <li className="Tag">
    <button type="button" onClick={() => props.onClick(props.value)}>
      {props.image && <img src={props.image} />}
      {props.value}
    </button>
  </li>
);
