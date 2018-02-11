import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import palette from 'google-palette';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const Graph = ({ styles, title, subtitle, config, series = [], description, actions = [] }) => {
  const formatter = (a, b) => {
    let res;
    if (Array.isArray(a)) {
      res = `${a[0].toFixed(3)} - ${a[1].toFixed(3)}°C`;
    } else {
      res = `${a.toFixed(3)}°C`;
    }
    return res;
  };
  const colors = palette('tol', config.seriesDetails.length);
  return (
    <Card style={styles}>
      <CardTitle title={title} subtitle={subtitle} />
      <CardMedia>
        <ResponsiveContainer minHeight={config.minHeight}>
          <ComposedChart data={series}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <Tooltip formatter={formatter} />
            <Legend />
            <CartesianGrid stroke='#f5f5f5' />
            <Area
              isAnimationActive={false}
              type='basis'
              name={config.seriesDetails[0].name}
              dataKey={config.seriesDetails[0].key}
              fill={`#${colors[0]}`}
              stroke={`#${colors[0]}`} />
            {
              config.seriesDetails.slice(1).map((x, i) => {
                return <Line key={i}
                  dot={false}
                  activeDot
                  isAnimationActive={false}
                  type='linear'
                  name={x.name}
                  dataKey={x.key}
                  stroke={`#${colors[i + 1]}`}
                  strokeWidth={2} />;
              })
            }
          </ComposedChart>
        </ResponsiveContainer>
      </CardMedia>
      <CardText>
        { description }
      </CardText>
      <CardActions>
        {
          actions.map((a, i) => <FlatButton key={i} label={a.label} href={a.href} />)
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
    seriesDetails: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired
    })).isRequired,
    xAxisKey: PropTypes.string.isRequired
  }).isRequired,
  description: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired }))
});

export default Graph;
