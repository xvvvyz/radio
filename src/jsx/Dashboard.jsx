import classNames from 'classnames';
import Inferno from 'inferno';
import Component from 'inferno-component';
import Header from './Header.jsx';
import Lists from './Lists.jsx';
import Search from './Search.jsx';
import '../scss/Dashboard.scss';

export default function Dashboard(props) {
  const header = <Header
    currentTags={ props.currentTags }
    removeTag={ props.removeTag }
  />;

  const search = <Search
    addTag={ props.addTag }
  />;

  const lists = <Lists
    related={ props.related }
    topArtists={ props.topArtists }
    topTags={ props.topTags }
    addTag={ props.addTag }
  />;

  const className = classNames({
    Dashboard: true,
    player_visible: props.playerVisible,
  })

  return <main className={ className }>{ header }{ search }{ lists }</main>;
};
