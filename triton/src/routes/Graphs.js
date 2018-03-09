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
      datasets: [],
      dataset: '',
      models: [],
      model: ''
    };
    this.datasetMenuHandler = this.datasetMenuHandler.bind(this);
    this.modelMenuHandler = this.modelMenuHandler.bind(this);
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
    this.setState({ datasets, models, dataset: datasets[0], model: models[0] });
  }

  modelMenuHandler = (e, i, v) => this.setState({ model: v });
  datasetMenuHandler = (e, i, v) => this.setState({ dataset: v })

  render () {
    const handlers = { datasetMenuHandler: this.datasetMenuHandler, modelMenuHandler: this.modelMenuHandler };
    return (
      <GraphController
        style={{ float:'right', height: '30vh', width: '40vw' }}
        handlers={handlers}
        datasets={this.state.datasets}
        dataset={this.state.dataset}
        models={this.state.models}
        model={this.state.model}
      />
    );
  }
}

export default Graphs;
