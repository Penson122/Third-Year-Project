import React, { Component } from 'react';
import Header from './components/Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { muiTheme } from './theme';
import './App.css';

class App extends Component {
  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Header />
      </MuiThemeProvider>
    );
  }
}

export default App;
