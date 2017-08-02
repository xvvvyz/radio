import Inferno from 'inferno';
import Component from 'inferno-component';
import Description from './Description.jsx';
import List from './List.jsx';
import '../scss/Lists.scss';

const MAX_LIST_ITEMS = 7;

export default function Lists(props) {
  return (
    <section className="Lists">
      <List
        title="Genres"
        items={ props.genres.slice(0, MAX_LIST_ITEMS) }
        addTags={ props.addTags }
        shuffle={ props.shuffleGenres }
      />
      <Description hide={ props.related.length } />
      <List
        title="Suggested"
        items={ props.related.slice(0, MAX_LIST_ITEMS) }
        addTags={ props.addTags }
        shuffle={ props.shuffleRelated }
      />
      <List
        title="Artists"
        items={ props.artists.slice(0, MAX_LIST_ITEMS) }
        addTags={ props.addTags }
        shuffle={ props.shuffleArtists }
      />
    </section>
  );
};
