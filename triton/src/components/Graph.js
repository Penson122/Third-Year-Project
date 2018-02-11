import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

HighchartsMore(ReactHighcharts.Highcharts);

const Graph = ({ styles, title, subtitle, config, description, actions = [] }) => {
  return (
    <Card style={styles}>
      <CardTitle title={title} subtitle={subtitle} />
      <CardMedia>
        <ReactHighcharts config={config} isPureConfig />
      </CardMedia>
      <CardText>
        { description }
      </CardText>
      <CardActions>
        {
          actions.map(a => <FlatButton label={a.label} href={a.href} />)
        }
      </CardActions>
    </Card>
  );
};

Graph.propTypes = ({
  styles: stylePropType,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  config: PropTypes.object.isRequired,
  description: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired }))
});

export default Graph;
