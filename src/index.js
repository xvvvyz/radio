import Inferno from 'inferno';
import App from './jsx/App.jsx';

document.getElementById('loading').remove();
Inferno.render(<App />, document.getElementById('inferno-app'));
