import Inferno from 'inferno';
import Component from 'inferno-component';
import CurrentTags from './CurrentTags.jsx';
import '../scss/Header.scss'

export default class Header extends Component {
  render() {
    return (
      <header className="Header">
        <h1><a href="/">Line Rad.io</a></h1>
        <CurrentTags
          currentTags={ this.props.currentTags }
          removeTag={ this.props.removeTag }
        />
      </header>
    );
  }
}
