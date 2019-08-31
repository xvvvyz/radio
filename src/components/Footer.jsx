import React from 'react';
import './Footer.scss';

const Footer = () => (
  <footer className="Footer">
    <span>
      Powered by &nbsp;
      <a href="https://8tracks.com" rel="noopener noreferrer" target="_blank">
        8tracks
      </a>
      ,{' '}
      <a href="https://www.last.fm" rel="noopener noreferrer" target="_blank">
        Last.fm
      </a>{' '}
      &amp;{' '}
      <a
        href="https://unsplash.com/collections/8541150/line-radio-background-images"
        rel="noopener noreferrer"
        target="_blank"
      >
        Unsplash
      </a>
    </span>
    <span>
      Source on &nbsp;
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
