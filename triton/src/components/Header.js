import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  appBar: {
   flexWrap: 'wrap',
  },
  tabs: {
   width: '50%',
   paddingTop: '0.5ex',
   paddingRight: '20%'
  },
};

const Navigation = () => (
  <Tabs style={styles.tabs}>
    <Tab label="About" />
    <Tab label="Graphs" />
    <Tab label="Resources"/>
  </Tabs>
);

class Header extends React.Component {
  render(){
    return(
      <AppBar title="TRITON" style={styles.appBar} showMenuIconButton={false}>
        <Navigation />
      </AppBar>
      )
  }
}

export default Header;