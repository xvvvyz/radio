import preact from 'preact';
import cn from 'classnames';
import Header from './Header.jsx';
import Lists from './Lists.jsx';
import Search from './Search.jsx';
import '../scss/Dashboard.scss';

export default props => (
  <main
    className={cn({
      Dashboard: true,
      player_visible: props.playerVisible,
    })}
  >
    <Header
      currentTags={props.currentTags}
      removeTag={props.removeTag}
    />
    <Search
      addTags={props.addTags}
    />
    <Lists
      addTags={props.addTags}
      artists={props.artists}
      genres={props.genres}
      related={props.related}
      shuffleArtists={props.shuffleArtists}
      shuffleGenres={props.shuffleGenres}
      shuffleRelated={props.shuffleRelated}
    />
  </main>
);
