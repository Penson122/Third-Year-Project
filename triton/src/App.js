import React, { Component } from 'react';
import logo from './logo.svg';
import {green500, green700, grey400, deepPurple900, deepPurpleA700, deepPurpleA100} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import './App.css';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: grey400,
    accent1Color: deepPurpleA700,
    accent2Color: deepPurpleA100,
    accent3Color: deepPurple900,
  }
});

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

class App extends Component {
  render() {
    return (
     <MuiThemeProvider muiTheme={muiTheme}>
        <AppBar title="TRITON" style={styles.appBar} showMenuIconButton={false}>
          <Navigation />
        </AppBar>
     </MuiThemeProvider>
    );
  }
}

export default App;
