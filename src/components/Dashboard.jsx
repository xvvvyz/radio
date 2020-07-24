import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Lists from './Lists';
import Search from './Search';
import './Dashboard.scss';

const Dashboard = (props) => (
  <main
    className={cn({
      Dashboard: true,
      player_visible: props.playerVisible,
    })}
  >
    <Header {...props} />
    <Search {...props} />
    <Lists {...props} />
    <Footer />
  </main>
);

Dashboard.propTypes = {
  playerVisible: PropTypes.bool.isRequired,
};

export default Dashboard;
