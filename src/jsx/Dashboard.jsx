import Inferno from 'inferno';
import Component from 'inferno-component';
import Header from './Header.jsx';
import List from './List.jsx';
import Lists from './Lists.jsx';
import Search from './Search.jsx';
import '../scss/Dashboard.scss';

export default function Dashboard(props) {
  const lists = props.lists.map(list => {
    if (list.tags && list.tags.length) {
      return <List
        title={ list.name }
        items={ list.tags }
        addTag={ props.addTag }
      />;
    }
  });

  return (
    <main className="Dashboard">
      <Header currentTags={ props.currentTags } removeTag={ props.removeTag } />
      <Search addTag={ props.addTag } />
      <Lists>{ lists }</Lists>
    </main>
  );
};
