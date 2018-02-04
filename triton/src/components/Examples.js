import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import ReactHighcharts from 'react-highcharts';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

HighchartsMore(ReactHighcharts.Highcharts);

const styles = {
  card: {
    margin: '1% 10%',
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

const Examples = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <h2 style={{ textAlign: 'center', verticalAlign: 'middle' }}>Examples coming soon!</h2>
    <GlobalTemperaturesSmoothedCard />
  </div>
);

class GlobalTemperaturesSmoothedCard extends React.Component {
  async componentWillMount () {
    let hadCrutMeans;
    let cowtanMeans;
    let modelMeans;
    try {
      let hadcrut = await fetch('/api/observations/hadcrut4Annual/1960/2020/1961/1999');
      let cowtan = await fetch('/api/observations/cowtan/1960/2020/1961/1999');
      cowtan = await cowtan.json();
      hadcrut = await hadcrut.json();
      let cmip = await fetch(`/api/models/cmip3/1960/2030/1961/1999?lowerBound=5&upperBound=95`);
      cmip = await cmip.json();
      modelMeans = cmip.map(m => [Date.UTC(m.year), m.data[0].mean, m.data[1].mean]);
      hadCrutMeans = hadcrut.map(h => [Date.UTC(h.year), h.mean]);
      cowtanMeans = cowtan.map(c => [Date.UTC(c.year), c.mean]);
    } catch (e) {
      console.error('failed to load resource hadcrut');
    }
    const chartState = {
      title: {
        text: 'Global Temperature in relative degrees celsius'
      },
      yAxis: {
        title: {
          text: 'Global Surface Air Tempurature'
        }
      },
      series: [{
        name: 'HadCRUT4 Surface Air Tempurature',
        type: 'line',
        data: hadCrutMeans
      }, {
        name: 'Cowtan and Waye Surface Air Temperature',
        type: 'line',
        data: cowtanMeans
      }, {
        name: 'CMIP3 Estimated Tempuratures',
        type: 'arearange',
        data: modelMeans,
        lineWidth: 0,
        color: Highcharts.getOptions().colors[2],
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
          enabled: false
        }
      }],
      ...config
    };
    this.setState(chartState);
  }

  render () {
    return (
      <Card style={styles.card}>
        <CardTitle title='Global Average Temperature' subtitle='HadCRUT4 Decadally Smoothed' />
        <CardMedia>
          <ReactHighcharts config={this.state ? this.state : {}} />
        </CardMedia>
        <CardText>
          The HadCRUT4 near surface temperature data set is produced by blending data from the CRUTEM4 surface air temperature dataset and the HadSST3 sea-surface temperature dataset.
          These 'best estimate' series are computed as the medians of regional time series computed for each of the 100 ensemble member realisations.
          Time series are presented as temperature anomalies (deg C) relative to 1961-1990.
        </CardText>
        <CardActions>
          <FlatButton label='Source' href='http://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html' />
        </CardActions>
      </Card>
    );
  }
}

export default Examples;
