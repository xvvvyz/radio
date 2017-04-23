import Inferno from 'inferno';
import Component from 'inferno-component';
import List from './List.jsx';
import '../scss/Lists.scss';

export default function Lists(props) {
  const related = <List
    title="Related"
    items={ props.related }
    addTag={ props.addTag }
    fullWidth
  />;

  const topArtists = <List
    title="Artists"
    items={ props.topArtists }
    addTag={ props.addTag }
  />;

  const topTags = <List
    title="Genres"
    items={ props.topTags }
    addTag={ props.addTag }
  />;

  return (
    <section className="Lists">
      { related }
      { topArtists }
      { topTags }
    </section>
  );
};
