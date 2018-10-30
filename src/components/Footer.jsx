import React from 'react';
import '../styles/Footer.scss';

const Footer = () => (
  <footer className="Footer">
    <span>
      Powered by
      &nbsp;
      <a
        href="https://8tracks.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        8tracks
      </a>
      &nbsp;
      &amp;
      &nbsp;
      <a
        href="https://www.last.fm"
        rel="noopener noreferrer"
        target="_blank"
      >
        Last.fm
      </a>
    </span>
    <span className="Footer_line" />
    <span>
      Source on
      &nbsp;
      <a
        href="https://github.com/cadejscroggins/linerad.io"
        rel="noopener noreferrer"
        target="_blank"
      >
        GitHub
      </a>
    </span>
  </footer>
);

export default Footer;
