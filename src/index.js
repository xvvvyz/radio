import preact from 'preact';
import App from './js/App.jsx';

document.getElementById('splash').remove();
preact.render(<App />, document.getElementById('app'));
