import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import Svg from './svg.jsx';
import Tag from './Tag.jsx';
import '../scss/List.scss';
import shuffleSvg from '../svg/shuffle.svg';

export default function List(props) {
  if (!props.items.length) return;

  const title = (
    <button className="List_header" onClick={ props.shuffle }>
      <h3>
        <span>{ props.title }</span>
        <Svg src={ shuffleSvg } />
      </h3>
    </button>
  );

  const items = props.items.map(item => {
    const isObj = typeof item === 'object';

    return <Tag
      value={ isObj ? item.name : item }
      image={ isObj ? item.image : null }
      onClick={ props.addTags }
    />;
  });

  const className = classNames({ List: true, full_width: props.fullWidth });

  return (
    <div className={ className }>
      { props.title && title}
      <ul>{ items }</ul>
    </div>
  );
};
