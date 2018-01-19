import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more';
import ReactHighcharts from 'react-highcharts';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

HighchartsMore(ReactHighcharts.Highcharts);

// const HadCRUT4 = require('./../data/HadCRUT4.json');
// const HadCRUT4Months = require('./../data/HadCRUT4.months.json');

const styles = {
  card: {
    margin: '1% 10%',
  }
};

const config = {
  config : {
    chart: {
      zommType: 'x'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Global Average Temperature Relative to 1961-1990'
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: '°C'
    },
    xAxis: {
      type: 'datetime',
      maxZoom: 48 * 3600 * 1000
    }
  }
};

const Examples = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <h2 style={{ textAlign: 'center', verticalAlign: 'middle' }}>Examples coming soon!</h2>
  </div>
);

// class GlobalTemperaturesSmoothedCard extends React.Component {
//   constructor (props) {
//     super(props);
//     this.state = JSON.parse(JSON.stringify(config));
//   }
//
//   componentDidMount () {
//     let means = this.getMeans();
//     let ranges = this.getRanges();
//     this.setState({ series: [
//       {
//         name: 'Temperature',
//         data: means,
//         marker:
//       {
//         fillColor: 'white',
//         lineWidth: 4,
//         lineColor: Highcharts.getOptions().colors[2]
//       }
//       }, {
//         name: 'Range',
//         data: ranges,
//         type: 'arearange',
//         lineWidth: 0,
//         linkedTo: ':previous',
//         color: ReactHighcharts.Highcharts.getOptions().colors[0],
//         fillOpacity: 0.3,
//         zIndex: 0
//       }] });
//   }
//
//   getMeans () {
//     let means = HadCRUT4.map((e, i) => {
//       let temp = [];
//       temp.push(Date.UTC(e.date, 0, 1));
//       temp.push(e.data[0]);
//       return temp;
//     });
//     return means;
//   }
//
//   getRanges () {
//     let ranges = HadCRUT4.map((e, i) => {
//       let temp = [];
//       // move utc dates into data compilation
//       // change this to redux call to api
//       // /GET: source/:name/:type
//       // then use req.query to grab ?fields="date, mean"
//       // /GET: api.com/source/hadcrut4/decade-smoothed?fields=data,range
//       temp.push(Date.UTC(e.date, 0, 1));
//       temp.push(e.data[1]);
//       temp.push(e.data[2]);
//       return temp;
//     });
//     return ranges;
//   }
//
//   render () {
//     return (
//       <Card style={styles.card}>
//         <CardTitle title='Global Average Temperature' subtitle='HadCRUT4 Decadally Smoothed' />
//         <CardMedia>
//           <ReactHighcharts config={this.state} />
//         </CardMedia>
//         <CardText>
//           The HadCRUT4 near surface temperature data set is produced by blending data from the CRUTEM4 surface air temperature dataset and the HadSST3 sea-surface temperature dataset.
//           These 'best estimate' series are computed as the medians of regional time series computed for each of the 100 ensemble member realisations.
//           Time series are presented as temperature anomalies (deg C) relative to 1961-1990.
//         </CardText>
//         <CardActions>
//           <FlatButton label='Source' href='http://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html' />
//         </CardActions>
//       </Card>
//     );
//   }
// }

// class GlobalTemperatures extends React.Component {
//   constructor (props) {
//     super(props);
//     this.state = JSON.parse(JSON.stringify(config));
//   }
//   componentDidMount () {
//     this.getMeans();
//   }

//   getMeans () {
//     const monthlyAverages = HadCRUT4Months.map((e, i) => {
//       let temp = [];
//       Object.entries(e).forEach(([key, value]) => {
//         let year = key;
//         Object.entries(value).forEach(([month, data]) => {
//           let UTCDate = Date.UTC(year, month);
//           temp.push([UTCDate, data[0]]);
//         });
//       });
//       return temp;
//     });
//     console.log('Monthly Dataset');
//     console.log(HadCRUT4Months);
//     return monthlyAverages;
//   }

//   // getMeans(){
//   //   let means = HadCRUT4.map((e, i) => {
//   //     let temp = [];
//   //     temp.push(Date.UTC(e.date, 0, 1));
//   //     temp.push(e.data[0]);
//   //     return temp;
//   //   });
//   //   return means;
//   // }

//   getRanges () {

//   }

//   render () {
//     return (
//       <Card style={styles.card}>
//         <CardTitle title='Global Average Temperature' subtitle='HadCRUT4 Decadally Smoothed' />
//         <CardMedia>
//           <ReactHighcharts config={this.state} />
//         </CardMedia>
//         <CardText>
//           The HadCRUT4 near surface temperature data set is produced by blending data from the CRUTEM4 surface air temperature dataset and the HadSST3 sea-surface temperature dataset.
//           These 'best estimate' series are computed as the medians of regional time series computed for each of the 100 ensemble member realisations.
//           Time series are presented as temperature anomalies (deg C) relative to 1961-1990.
//         </CardText>
//         <CardActions>
//           <FlatButton label='Source' href='http://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html' />
//         </CardActions>
//       </Card>
//     );
//   }
// }

export default Examples;
