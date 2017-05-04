import Inferno from 'inferno';
import Component from 'inferno-component';
import List from './List.jsx';
import '../scss/Lists.scss';

export default function Lists(props) {
  return (
    <section className="Lists">
      <List
        title="Suggested"
        items={ props.related }
        addTags={ props.addTags }
        shuffle={ props.shuffleRelated }
        fullWidth
      />
      <List
        title="Artists"
        items={ props.topArtists }
        addTags={ props.addTags }
        shuffle={ props.shuffleTopArtists }
      />
      <List
        title="Genres"
        items={ props.topTags }
        addTags={ props.addTags }
        shuffle={ props.shuffleTopTags }
      />
    </section>
  );
};
