import React from 'react';
import PropTypes from 'prop-types';

const style = {
  color: 'rgb(255, 125, 125)'
};

const ErrorWarning = ({ text }) => (
  <h1 style={style} >{text}</h1>
);

ErrorWarning.propTypes = {
  text: PropTypes.string.isRequired
};

export default ErrorWarning;
