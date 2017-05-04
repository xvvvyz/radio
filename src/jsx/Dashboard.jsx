import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import Header from './Header.jsx';
import Lists from './Lists.jsx';
import Search from './Search.jsx';
import '../scss/Dashboard.scss';

export default function Dashboard(props) {
  const className = classNames({
    Dashboard: true,
    player_visible: props.playerVisible,
  })

  return (
    <main className={ className }>
      <Header
        currentTags={ props.currentTags }
        removeTag={ props.removeTag }
      />
      <Search
        addTags={ props.addTags }
      />
      <Lists
        related={ props.related }
        topArtists={ props.topArtists }
        topTags={ props.topTags }
        addTags={ props.addTags }
        shuffleTopArtists={ props.shuffleTopArtists }
        shuffleTopTags={ props.shuffleTopTags }
        shuffleRelated={ props.shuffleRelated }
      />
    </main>
  );
};
