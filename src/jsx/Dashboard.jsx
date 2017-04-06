import Inferno from 'inferno';
import Component from 'inferno-component';
import Header from './Header.jsx';
import Search from './Search.jsx';
import Lists from './Lists.jsx';
import List from './List.jsx';
import '../scss/Dashboard.scss';

export default class Dashboard extends Component {
  render() {
    const lists = this.props.lists.map(list => {
      if (list.tags && list.tags.length) {
        return <List
          title={ list.name }
          items={ list.tags }
          addTag={ this.props.addTag }
        />;
      }
    });

    return (
      <main className="Dashboard">
        <Header
          currentTags={ this.props.currentTags }
          removeTag={ this.props.removeTag }
        />
        <Search />
        <Lists>{ lists }</Lists>
      </main>
    );
  }
}
