import preact from 'preact';
import '../scss/Footer.scss';

export default () => (
  <footer className="Footer">
    <span>Powered by <a href="https://8tracks.com" target="_blank">8tracks</a> &amp; <a href="https://www.last.fm" target="_blank">Last.fm</a></span>
    <span className="Footer_line" />
    <span>Source on <a href="https://github.com/cadejscroggins/linerad.io" target="_blank">GitHub</a></span>
  </footer>
);
