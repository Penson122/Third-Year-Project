import React, { Component } from 'react';

// material UI themes
import { green500, green700, grey400, yellowA200, yellow300, yellowA400 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// ui components
import Header from './components/Header';

import './App.css';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: grey400,
    accent1Color: yellowA400,
    accent2Color: yellow300,
    accent3Color: yellowA200,
  }
});

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
