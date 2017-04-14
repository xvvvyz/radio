import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/Lists.scss';

export default function Lists(props) {
  return <section className="Lists">{ props.children }</section>;
};
