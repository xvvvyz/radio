import preact from 'preact';
import cn from 'classnames';
import Footer from './Footer';
import Header from './Header';
import Lists from './Lists';
import Search from './Search';
import Suggestions from './Suggestions';
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
    <Search addTags={props.addTags} />
    <Lists
      addTags={props.addTags}
      artists={props.artists}
      genres={props.genres}
      related={props.related}
      shuffleArtists={props.shuffleArtists}
      shuffleGenres={props.shuffleGenres}
      shuffleRelated={props.shuffleRelated}
    />
    <Suggestions
      addTags={props.addTags}
      playerVisible={props.playerVisible}
      suggestions={props.suggestions}
    />
    {props.footerVisible && <Footer />}
  </main>
);
