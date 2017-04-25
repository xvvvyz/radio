import Inferno from 'inferno';
import Component from 'inferno-component';
import Tag from './Tag.jsx';
import '../scss/CurrentTags.scss';

export default function CurrentTags(props) {
  if (!props.currentTags.length) return;

  const tags = props.currentTags.map(tag => {
    return <Tag onClick={ props.removeTag } value={ tag } />;
  });

  return <ul className="CurrentTags">{ tags }</ul>;
};
