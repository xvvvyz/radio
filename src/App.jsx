import Inferno from 'inferno';
import Component from 'inferno-component';
import './App.scss';
import Svg from './Svg.jsx';
import logo from './img/logo.svg';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Line Radio</h1>
        <Svg src={ logo } />
      </div>
    );
  }
}
