import Inferno from 'inferno';
import Component from 'inferno-component';
import List from './List.jsx';
import '../scss/Lists.scss';

export default function Lists(props) {
  return (
    <section className="Lists">
      <List
        title="Related"
        items={ props.related }
        addTag={ props.addTag }
        fullWidth
      />
      <List
        title="Artists"
        items={ props.topArtists }
        addTag={ props.addTag }
      />
      <List
        title="Genres"
        items={ props.topTags }
        addTag={ props.addTag }
      />
    </section>
  );
};
