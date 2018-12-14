import React from 'react';
import bg from '../images/bg.jpg';
import cn from 'classnames';
import './Background.scss';

const Background = ({ hide }) => (
  <img alt="" className={cn({ App_background: true, hide })} src={bg} />
);

export default Background;
