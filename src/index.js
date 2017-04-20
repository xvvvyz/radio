import Inferno from 'inferno';
import App from './jsx/App.jsx';

document.getElementById('splash').remove();
Inferno.render(<App />, document.getElementById('inferno-app'));
