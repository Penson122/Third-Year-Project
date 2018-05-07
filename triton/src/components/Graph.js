import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend } from 'recharts';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const Graph = ({ styles, title, subtitle, config, series = [],
  description, actions = [], children }) => {
  const formatter = (a, b) => {
    let res;
    if (Array.isArray(a)) {
      res = `${a[0].toFixed(3)} - ${a[1].toFixed(3)}°C`;
    } else {
      res = `${a.toFixed(3)}°C`;
    }
    return res;
  };
  return (
    <Card style={styles}>
      <CardTitle
        title={title}
        subtitle={subtitle}
        style={{ textAlign: 'center' }} />
      <CardMedia>
        <ResponsiveContainer minHeight={config.minHeight}>
          <ComposedChart data={series}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <Tooltip formatter={formatter} />
            <Legend />
            <CartesianGrid stroke='#f5f5f5' />
            {children}
          </ComposedChart>
        </ResponsiveContainer>
      </CardMedia>
      <CardText>
        { description }
      </CardText>
      <CardActions>
        {
          actions.map((a, i) =>
            <FlatButton key={i} label={a.label} href={a.href} />)
        }
      </CardActions>
    </Card>
  );
};

Graph.propTypes = ({
  styles: stylePropType,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  series: PropTypes.array,
  config: PropTypes.shape({
    xAxisKey: PropTypes.string.isRequired
  }).isRequired,
  description: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape(
    { label: PropTypes.string.isRequired, href: PropTypes.string.isRequired }))
});

export default Graph;
