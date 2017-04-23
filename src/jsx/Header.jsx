import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import CurrentTags from './CurrentTags.jsx';
import '../scss/Header.scss'

export default function Header(props) {
  const title = <h1><a href="/">Line Radio</a></h1>;
  const subTitle = <h2>Streamlined Music Discovery</h2>;

  const currentTags = <CurrentTags
    currentTags={ props.currentTags }
    removeTag={ props.removeTag }
  />;

  const className = classNames({
    Header: true,
    tags_exist: props.currentTags.length > 0,
  });

  return <header className={ className }>
    { title }
    { subTitle }
    { props.currentTags.length ? currentTags : null }
  </header>;
};
