import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../components/Graph';

const styles = {
  card: {
    margin: '1% 3%',
  }
};

const getDataset = async (url) => {
  let dataset = await fetch(url);
  return dataset.json();
};

const Examples = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <div style={{ float: 'left', width: '50vw' }}>
      <ExampleGraph
        title='Global Average Temperatures Smoothed'
        subtitle='Comparison of model estimates and surface air temperatures'
        text='Baseline period of 1961-1999'
        observationPeriod='1960/2020/1961/1999'
        modelPeriod='1960/2030/1961/1999' />
    </div>
    <div style={{ float: 'right', width: '50vw' }}>
      <ExampleGraph
        title='Global Average Temperatures Smoothed'
        subtitle='The effect of baselining on model estimates'
        text='Baseline period of 1998-1999'
        observationPeriod='1960/2020/1998/1998'
        modelPeriod='1960/2030/1998/1998' />
    </div>
  </div>
);

class ExampleGraph extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      chart: {
        minHeight: '40vh',
        xAxisKey: 'year',
        seriesDetails: [
          { name: 'CMIP3', key: 'range' },
          { name: 'HadCRUT4', key: 'hadcrutMean' },
          { name: 'Cowtan and Way', key: 'cowtanMean' },
          { name: 'GISTEMP', key: 'gistempMean' }]
      }
    };
  }
  async componentWillMount () {
    let hadCrutMeans = await getDataset(`/api/observations/hadcrut4Annual/${this.props.observationPeriod}`);
    let cowtanMeans = await getDataset(`/api/observations/cowtan/${this.props.observationPeriod}`);
    let modelMeans =
      await getDataset(`/api/models/cmip3/${this.props.modelPeriod}?lowerBound=5&upperBound=95`);
    let gistempMeans = await getDataset(`/api/observations/gistemp/${this.props.observationPeriod}`);
    const series = modelMeans.map((x, i) => {
      let res = ({ year: x.year, range: [x.data[0].mean, x.data[1].mean] });
      return Object.assign(res, hadCrutMeans[i] && {
        hadcrutMean: hadCrutMeans[i].mean,
        cowtanMean: cowtanMeans[i].mean,
        gistempMean: gistempMeans[i].mean
      });
    });
    this.setState({ series: series });
  }

  render () {
    return (
      <Graph
        styles={styles.card}
        title={this.props.title}
        subtitle={this.props.subtitle}
        config={this.state.chart}
        series={this.state.series}
        description={this.props.text}
      />
    );
  }
}

ExampleGraph.propTypes = ({
  observationPeriod: PropTypes.string.isRequired,
  modelPeriod: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
});

export default Examples;
