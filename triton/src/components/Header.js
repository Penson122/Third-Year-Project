import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import About from '../routes/About';
import Graphs from '../routes/Graphs';
import Resources from '../routes/Resources';
import Examples from '../routes/Examples';

const styles = {
  appBar: {
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  tabs: {
    width: '50%',
    paddingTop: '0.5ex',
    paddingRight: '25%',
    paddingLeft: '5%'
  },
};

const routes = [
  {
    name: 'About',
    path: '/about',
    element: <Link to='/about' />,
    component: About
  }, {
    name: 'Examples',
    path: '/examples',
    element: <Link to='/examples' />,
    component: Examples
  }, {
    name: 'Graphs',
    path: '/graphs',
    element: <Link to='/graphs' />,
    component: Graphs
  }, {
    name: 'Resources',
    path: '/resources',
    element: <Link to='/resources' />,
    component: Resources
  }
];

const Navigation = () => (
  <Tabs style={styles.tabs}>
    { routes.map(r => <Tab label={r.name} containerElement={r.element} />) }
  </Tabs>
);

class Header extends React.Component {
  render () {
    return (
      <Router>
        <div>
          <AppBar title='TRITON' style={styles.appBar} showMenuIconButton={false}>
            <Navigation />
          </AppBar>
          { routes.map(r => <Route path={r.path} component={r.component} />) }
        </div>
      </Router>
    );
  }
}

export default Header;
