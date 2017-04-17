import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import CurrentTags from './CurrentTags.jsx';
import '../scss/Header.scss'

export default function Header(props) {
  const className = classNames({
    Header: true,
    'tags-exist': props.currentTags.length > 0,
  });

  return (
    <header className={ className }>
      <h1><a href="/">Line Radio</a></h1>
      <CurrentTags
        currentTags={ props.currentTags }
        removeTag={ props.removeTag }
      />
    </header>
  );
};
