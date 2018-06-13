import preact from 'preact';
import '../scss/Suggestions.scss';

export default class Suggestions extends preact.Component {
  render() {
    const { addTags, playerVisible, suggestions } = this.props;
    const suggestionText = suggestions.join(' + ');
    const homeText = 'No ideas? Try';
    const playerText = 'No good? Try';

    return (
      <div className="Suggestions">
        <p>
          {playerVisible ? playerText : homeText} <button onClick={() => addTags([...suggestions])}>{suggestionText}</button>
        </p>
      </div>
    );
  }
}
