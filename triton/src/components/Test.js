import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { muiTheme } from '../theme';
//
// class Test extends React.Component {
//   render () {
//     return (
//       <MuiThemeProvider muiTheme={muiTheme}>
//         { this.props.children }
//       </MuiThemeProvider>
//     );
//   }
// }

const Test = ({ children }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    { children }
  </MuiThemeProvider>
);

Test.propTypes = ({
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
});

export default Test;
