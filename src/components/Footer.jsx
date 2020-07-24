import React from 'react';
import './Footer.scss';

const Footer = () => (
  <footer className="Footer">
    Powered&nbsp;by&nbsp;
    <a href="https://8tracks.com" rel="noopener noreferrer" target="_blank">
      8tracks
    </a>
    ,&nbsp;
    <a href="https://www.last.fm" rel="noopener noreferrer" target="_blank">
      Last.fm
    </a>
    &nbsp;&amp;&nbsp;
    <a
      href="https://unsplash.com/collections/8541150/line-radio-background-images"
      rel="noopener noreferrer"
      target="_blank"
    >
      Unsplash
    </a>
    &nbsp;&mdash; Source&nbsp;on&nbsp;&nbsp;
    <a
      href="https://github.com/cadejscroggins/lineradio.app"
      rel="noopener noreferrer"
      target="_blank"
    >
      GitHub
    </a>
  </footer>
);

export default Footer;
