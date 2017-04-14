import Inferno from 'inferno';
import Component from 'inferno-component';

export default function Svg(props) {
  return (
    <svg className={ props.className }>
      <use xlink:href={ props.src } />
    </svg>
  );
};
