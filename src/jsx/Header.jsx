import Inferno from 'inferno';
import cn from 'classnames';
import CurrentTags from './CurrentTags.jsx';
import '../scss/Header.scss';

export default function Header(props) {
  return (
    <header
      className={cn({
        Header: true,
        tags_exist: !!props.currentTags.length
      })}
    >
      <h1><a href="/">Line Radio</a></h1>
      <h2>Streamlined Music Discovery</h2>
      <CurrentTags
        currentTags={props.currentTags}
        removeTag={props.removeTag}
      />
    </header>
  );
};
