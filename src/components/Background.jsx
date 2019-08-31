import React from 'react';
import cn from 'classnames';
import './Background.scss';

const Background = ({ src, hide }) => (
  <img
    alt=""
    className={cn({ App_background: true, hide })}
    src="https://source.unsplash.com/collection/8541150"
  />
);

export default Background;
