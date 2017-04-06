import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/Search.scss';

export default class Search extends Component {
  render() {
    return (
      <section className="Search">
        <input type="text" placeholder="Search for any activity, artist, genre or mood..." />
      </section>
    );
  }
}
