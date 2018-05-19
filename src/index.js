import preact from 'preact';
import App from './js/App';

document.getElementById('splash').remove();
preact.render(<App />, document.getElementById('app'));
