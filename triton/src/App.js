import React, { Component } from 'react';

//material UI themes
import {green500, green700, grey400, deepPurple900, deepPurpleA700, deepPurpleA100} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

//ui components
import Header from './components/Header'

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

class App extends Component {
  render() {
    return (
     <MuiThemeProvider muiTheme={muiTheme}>
      <Header />
     </MuiThemeProvider>
    );
  }
}

export default App;
