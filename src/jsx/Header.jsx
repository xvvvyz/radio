import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import CurrentTags from './CurrentTags.jsx';
import '../scss/Header.scss'

export default function Header(props) {
  const className = classNames({
    Header: true,
    tags_exist: !!props.currentTags.length,
  });

  return (
    <header className={ className }>
      <h1><a href="/">Line Radio</a></h1>
      <h2>Streamlined Music Discovery</h2>
      <CurrentTags
        currentTags={ props.currentTags }
        removeTag={ props.removeTag }
      />
    </header>
  );
};
