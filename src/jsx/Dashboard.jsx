import Inferno from 'inferno';
import Component from 'inferno-component';
import Header from './Header.jsx';
import List from './List.jsx';
import Lists from './Lists.jsx';
import Search from './Search.jsx';
import '../scss/Dashboard.scss';

export default class Dashboard extends Component {
  renderHeader() {
    return <Header
      currentTags={ this.props.currentTags }
      removeTag={ this.props.removeTag }
    />;
  }

  renderSearch() {
    return <Search addTag={ this.props.addTag } />;
  }

  renderLists() {
    const lists = this.props.lists.map(list => {
      if (list.tags && list.tags.length) {
        return <List
          title={ list.name }
          items={ list.tags }
          addTag={ this.props.addTag }
        />;
      }
    });

    return <Lists>{ lists }</Lists>;
  }

  render() {
    return (
      <main className="Dashboard">
        { this.renderHeader() }
        { this.renderSearch() }
        { this.renderLists() }
      </main>
    );
  }
}
