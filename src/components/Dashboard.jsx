import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Lists from './Lists';
import Search from './Search';
import Suggestions from './Suggestions';
import '../styles/Dashboard.scss';

const Dashboard = props => (
  <main
    className={cn({
      Dashboard: true,
      player_visible: props.playerVisible,
    })}
  >
    <Header {...props} />
    <Search {...props} />
    <Lists {...props} />
    <Suggestions {...props} />
    {props.footerVisible && <Footer />}
  </main>
);

Dashboard.propTypes = {
  footerVisible: PropTypes.bool.isRequired,
  playerVisible: PropTypes.bool.isRequired,
};

export default Dashboard;
