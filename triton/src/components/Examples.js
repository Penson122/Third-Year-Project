import React from 'react';
import HighchartsMore from 'highcharts-more';
import ReactHighcharts from 'react-highcharts';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

HighchartsMore(ReactHighcharts.Highcharts);

const styles = {
  card: {
    margin: '1% 3%',
  }
};

const config = {
  credits: {
    enabled: false
  },
  tooltip: {
    crosshairs: true,
    formatter: function () {
      var s = '<b>' + new Date(this.x).getFullYear() + '</b>';
      this.points.forEach((x) => {
        s += `<br/>${x.series.name}: <b>${x.y.toFixed(3)}</b>°C`;
      });
      return s;
    },
    shared: true
  },
  xAxis: {
    type: 'datetime'
  }
};

const lineMap = m => [Date.UTC(m.year), m.mean];
const areaMap = m => [Date.UTC(m.year), m.data[0].mean, m.data[1].mean];

const getDataset = async (url, mapper) => {
  let dataset = await fetch(url);
  dataset = await dataset.json();
  return dataset.map(mapper);
};

const Examples = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <h2 style={{ textAlign: 'center', verticalAlign: 'middle' }}>Examples coming soon!</h2>
    <div style={{ float: 'left', width: '50vw' }}>
      <GlobalTemperaturesSmoothedCard
        title='Global Average Temperatures Smoothed'
        subtitle='Comparison of model estimates and surface air temperatures'
        text='Baseline period of 1961-1999'
        observationPeriod='1960/2020/1961/1999'
        modelPeriod='1960/2030/1961/1999' />
    </div>
    <div style={{ float: 'right', width: '50vw' }}>
      <GlobalTemperaturesSmoothedCard
        title='Global Average Temperatures Smoothed'
        subtitle='The effect of baselining on model estimates'
        text='Baseline period of 1998-1999'
        observationPeriod='1960/2020/1989/1999'
        modelPeriod='1960/2030/1998/1999' />
    </div>
  </div>
);

class GlobalTemperaturesSmoothedCard extends React.Component {
  constructor (props) {
    super(props);
    const { observationPeriod, modelPeriod } = props;
    console.log(observationPeriod);
    this.state = {
      observationPeriod,
      modelPeriod,
      chart: {}
    };
  }
  async componentWillMount () {
    let hadCrutMeans = await getDataset(`/api/observations/hadcrut4Annual/${this.props.observationPeriod}`, lineMap);
    let cowtanMeans = await getDataset(`/api/observations/cowtan/${this.props.observationPeriod}`, lineMap);
    let modelMeans =
      await getDataset(`/api/models/cmip3/${this.props.modelPeriod}?lowerBound=5&upperBound=95`, areaMap);
    let gistempMeans = await getDataset(`/api/observations/gistemp/${this.props.observationPeriod}`, lineMap);
    const chartState = {
      title: {
        text: 'Global Temperature in relative degrees celsius'
      },
      yAxis: {
        title: {
          text: 'Global Surface Air Tempurature'
        },
        tickInterval: 0.2
      },
      series: [{
        name: 'CMIP3 Estimated Tempuratures',
        type: 'arearange',
        data: modelMeans,
        lineWidth: 0.5,
        fillOpacity: 0.2,
        zIndex: 0,
        marker: {
          enabled: false
        }
      }, {
        name: 'HadCRUT4 Surface Air Tempurature',
        type: 'line',
        data: hadCrutMeans
      }, {
        name: 'Cowtan and Waye Surface Air Temperature',
        type: 'line',
        data: cowtanMeans
      }, {
        name: 'GISTEMP Surface Air Temperature',
        type: 'line',
        data: gistempMeans
      }],
      ...config
    };
    this.setState({ chart: chartState });
  }

  render () {
    return (
      <Card style={styles.card}>
        <CardTitle title={this.props.title} subtitle={this.props.subtitle} />
        <CardMedia>
          <ReactHighcharts config={this.state.chart} isPureConfig />
        </CardMedia>
        <CardText>
          { this.props.text }
        </CardText>
        <CardActions>
          <FlatButton label='Source' href='http://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html' />
        </CardActions>
      </Card>
    );
  }
}

export default Examples;
