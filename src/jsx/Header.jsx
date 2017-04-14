import Inferno from 'inferno';
import Component from 'inferno-component';
import CurrentTags from './CurrentTags.jsx';
import '../scss/Header.scss'

export default function Header(props) {
  return (
    <header className="Header">
      <h1><a href="/">Line Rad.io</a></h1>
      <CurrentTags
        currentTags={ props.currentTags }
        removeTag={ props.removeTag }
      />
    </header>
  );
};
