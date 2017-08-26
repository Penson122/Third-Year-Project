import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


import About from './About';
import Graphs from './Graphs';
import Resources from './Resources'
import Examples from './Examples';

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

const Navigation = () => (

  <Tabs style={styles.tabs}>
    <Tab label="About" containerElement={<Link to="/about" />}/>
    <Tab label="Examples" containerElement={<Link to="/examples" />}/>
    <Tab label="Graphs" containerElement={<Link to="/graphs" />}/>
    <Tab label="Resources" containerElement={<Link to="/resources" />}/>
  </Tabs>
);

class Header extends React.Component {
  render(){
    return(
      <Router>
      <div>
      <AppBar title="TRITON" style={styles.appBar} showMenuIconButton={false}>
        <Navigation />
      </AppBar>

      <Route path="/about" component={About}/>
      <Route path="/examples" component={Examples}/>
      <Route path="/graphs" component={Graphs}/>
      <Route path="/resources" component={Resources}/>
      </div>
      </Router>
      )
  }
}

export default Header;