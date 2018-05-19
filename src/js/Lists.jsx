import preact from 'preact';
import List from './List';
import '../scss/Lists.scss';

const MAX_LIST_ITEMS = 5;

export default props => (
  <section className="Lists">
    <List
      addTags={props.addTags}
      items={props.related.slice(0, MAX_LIST_ITEMS)}
      shuffle={props.shuffleRelated}
      title="Suggested"
    />
    <List
      addTags={props.addTags}
      items={props.genres.slice(0, MAX_LIST_ITEMS)}
      shuffle={props.shuffleGenres}
      title="Genres"
    />
    <List
      addTags={props.addTags}
      items={props.artists.slice(0, MAX_LIST_ITEMS)}
      shuffle={props.shuffleArtists}
      title="Artists"
    />
  </section>
);
