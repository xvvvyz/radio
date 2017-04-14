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

  return (
    <div className="List">
      <h3>{ props.title }</h3>
      <ul>{ items }</ul>
    </div>
  );
};
