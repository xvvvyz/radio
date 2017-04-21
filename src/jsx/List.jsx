import Inferno from 'inferno';
import Component from 'inferno-component';
import Tag from './Tag.jsx';
import '../scss/List.scss';

export default function List(props) {
  const items = props.items.map(item => {
    const isObj = typeof item === 'object';

    return <Tag
      value={ isObj ? item.name : item }
      image={ isObj ? item.image : null }
      onClick={ props.addTag }
    />;
  });

  const list = <div className="List fade-in">
    { props.title ? <h3>{ props.title }</h3> : null }
    <ul>{ items }</ul>
  </div>;

  return items.length ? list : null;
};
