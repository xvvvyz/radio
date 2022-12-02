import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CurrentTags from './CurrentTags';
import logo from '../images/logo.svg';
import './Header.scss';

const Header = (props) => (
  <header
    className={cn({
      Header: true,
      tags_exist: !!props.currentTags.length,
    })}
  >
    <h1>
      <a href="/">
        <img alt="Radio" src={logo} />
      </a>
    </h1>
    <h2>Streamlined music discovery.</h2>
    <CurrentTags currentTags={props.currentTags} removeTag={props.removeTag} />
  </header>
);

Header.propTypes = {
  currentTags: PropTypes.array.isRequired,
};

export default Header;
