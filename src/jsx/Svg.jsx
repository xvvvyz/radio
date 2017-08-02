import Inferno from 'inferno';
import Component from 'inferno-component';

export default function Svg(props) {
  return (
    <svg viewBox={ props.src.viewBox }>
      <use xlink:href={ `#${props.src.id}` } />
    </svg>
  );
};
