import preact from 'preact';
import '../scss/Suggestions.scss';

export default class Suggestions extends preact.Component {
  getSuggestionText = () => {
    return this.props.suggestions.join(' + ');
  };

  handleSuggestionClick = () => {
    const { addTags, suggestions } = this.props;
    ga('send', 'event', 'suggestion', 'click', this.getSuggestionText());
    addTags([...suggestions]);
  };

  render() {
    const { playerVisible } = this.props;
    const homeText = 'No ideas? Try';
    const playerText = 'No good? Try';

    return (
      <div className="Suggestions">
        <p>
          {playerVisible ? playerText : homeText} <button onClick={this.handleSuggestionClick}>{this.getSuggestionText()}</button>
        </p>
      </div>
    );
  }
}
