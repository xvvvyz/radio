import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import Tag from './Tag.jsx';
import '../scss/List.scss';

export default function List(props) {
  if (!props.items.length) return;

  const items = props.items.map(item => {
    const isObj = typeof item === 'object';

    return <Tag
      value={ isObj ? item.name : item }
      image={ isObj ? item.image : null }
      onClick={ props.addTag }
    />;
  });

  const className = classNames({ List: true, full_width: props.fullWidth });

  return (
    <div className={ className }>
      { props.title && <h3>{ props.title }</h3> }
      <ul>{ items }</ul>
    </div>
  );
};
