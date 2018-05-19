import preact from 'preact';
import Tag from './Tag';
import shuffleSvg from '../svg/shuffle.svg';
import '../scss/List.scss';

export default props => !!props.items.length && (
  <div className="List">
    {props.title && <button
      className="List_header"
      onClick={props.shuffle}
    >
      <div className="List_title">{props.title}</div>
      <div className="List_shuffle"><img src={shuffleSvg} /></div>
    </button>}
    <ul>
      {props.items.map(item => <Tag
        value={typeof item === 'object' ? item.name : item}
        image={typeof item === 'object' ? item.image : null}
        onClick={props.addTags}
      />)}
    </ul>
  </div>
);
