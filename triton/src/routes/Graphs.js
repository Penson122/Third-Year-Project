import React from 'react';
import Graph from '../components/Graph';
import GraphController from '../components/GraphController';

const get = async (url) => {
  let dataset = await fetch(url);
  return dataset.json();
};

class Graphs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      series: [],
      currentSeries: '',
      baseline: {
        period: [1961, 1999],
        min: 1900,
        max: 2020
      },
      data: {
        period: [1900, 2017],
        min: 1900,
        max: 2018
      }
    };
    this.seriesHandler = this.seriesHandler.bind(this);
    this.baselineChange = this.baselineChange.bind(this);
    this.periodChange = this.periodChange.bind(this);
  }

  async componentWillMount () {
    let datasets;
    let models;
    try {
      datasets = await get('/api/list/observations');
      models = await get('/api/list/models');
    } catch (e) {
      datasets = this.state.datasets;
      models = this.state.models;
    }
    this.setState({ series: [...datasets, ...models], currentSeries: datasets[0] });
  }

  seriesHandler = (e, i, v) => this.setState({ currentSeries: v });
  baselineChange = values => {
    this.setState({ baseline:{ period: values, min: this.state.baseline.min, max: this.state.baseline.max } });
  }
  periodChange = values => {
    this.setState({ data:{ period: values, min: this.state.data.min, max: this.state.data.max } });
  }

  render () {
    const handlers = {
      seriesHandler: this.seriesHandler,
      modelMenuHandler: this.modelMenuHandler,
      baselineChange: this.baselineChange,
      periodChange: this.periodChange
    };
    return (
      <GraphController
        style={{ float:'right', height: '30vh', width: '40vw' }}
        handlers={handlers}
        series={this.state.series}
        currentSeries={this.state.currentSeries}
        baseline={this.state.baseline}
        data={this.state.data}
      />
    );
  }
}

export default Graphs;
