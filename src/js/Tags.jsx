import preact from 'preact';
import Tag from './Tag.jsx';
import '../scss/Tags.scss';

export default props => !!props.currentTags.length && (
  <ul className="CurrentTags">
    {props.currentTags.map(tag => (
      <Tag onClick={props.removeTag} value={tag} />
    ))}
  </ul>
);
