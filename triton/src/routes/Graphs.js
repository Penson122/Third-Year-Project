import React from 'react';
import Graph from '../components/Graph';
import { Area, Line } from 'recharts';
import GraphController from '../components/GraphController';
import ErrorWarning from '../components/ErrorWarning';
import palette from 'google-palette';

const greenToRed = (percent) => {
  const r = percent < 50
    ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
  const g = percent > 50
    ? 255 : Math.floor((percent * 2) * 255 / 100);
  return 'rgb(' + r + ',' + g + ',0)';
};

const get = async (type, item, periodStart, periodEnd,
  baselineStart, baselineEnd, addend = '') => {
  let dataset = await fetch('/api/' +
  type + '/' +
  item + '/' +
  periodStart + '/' +
  periodEnd + '/' +
  baselineStart + '/' +
  baselineEnd + addend);
  return dataset.json();
};

const getList = async (type) => {
  let list = await fetch(`/api/list/${type}`);
  return list.json();
};

class Graphs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: '',
      trackColor: greenToRed(100),
      modelColors: palette('tol-dv', 5),
      seriesColors: palette('tol', 5),
      timeoute: null,
      series: [],
      serieNames: [],
      modelNames: [],
      chips: [],
      currentSeries: '',
      currentModel: '',
      data: {
        period: [1950, 1961, 1999, 2030], // move baseline into period
        min: 1900,
        max: 2030
      },
      seriesDetails: [],
      modelDetails: [],
      chart: {
        minHeight: '40vh',
        xAxisKey: 'year'
      }
    };
    this.seriesHandler = this.seriesHandler.bind(this);
    this.periodChange = this.periodChange.bind(this);
    this.seriesSelector = this.seriesSelector.bind(this);
    this.modelHandler = this.modelHandler.bind(this);
    this.modelSelector = this.modelSelector.bind(this);
    this.rebaseline = this.rebaseline.bind(this);
    this.removeChip = this.removeChip.bind(this);
  }

  async componentWillMount () {
    let datasets;
    let models;
    try {
      datasets = await getList('observations');
      models = await getList('models');
    } catch (e) {
      datasets = this.state.datasets;
      models = this.state.models;
    }
    this.setState({
      serieNames: datasets.slice(0),
      modelNames: models,
      currentSeries: datasets[0],
      currentModel: models[0]
    });
    this.seriesSelector();
    this.modelSelector();
  }

  removeChip = (chip) => {
    const isSeries = this.state.serieNames.find(s => s === chip);
    const dataKey = isSeries ? `${chip}Mean` : `${chip}Range`;
    this.removeDataset(dataKey);
    this.setState({
      chips: this.state.chips.filter(s => s !== chip)
    });
  }

  seriesHandler = (e, i, v) => this.setState({ currentSeries: v });

  modelHandler = (e, i, v) => this.setState({ currentModel: v });

  rebaseline = () => {
    const { data } = this.state;
    this.state.seriesDetails.map(async x => {
      const serie = await
        get('observations', x.name, data.period[0], data.period[3],
          data.period[1], data.period[2]);
      const series = serie.map((s, i) => {
        const found = this.state.series.find(se => se.year === s.year);
        let res = {};
        if (found) {
          res = { ...found };
          res[`${x.name}Mean`] = s.mean;
        } else {
          res.year = s.year;
          res[`${x.name}Mean`] = s.mean;
        }
        return res;
      });
      this.setState({ series: series });
    });
    this.state.modelDetails.map(async x => {
      const model = await get('models', x.name, data.period[0],
        data.period[3], data.period[1], data.period[2],
        '?upperBound=95&lowerBound=5');
      const series = model.map((m, i) => {
        const found = this.state.series.find(se => se.year === m.year);
        let res = {};
        if (found) {
          res = { ...found };
          res[`${x.name}Range`] = [m.data[0].mean, m.data[1].mean];
        } else {
          res.year = m.year;
          res[`${x.name}Range`] = [m.data[0].mean, m.data[1].mean];
        }
        return res;
      });
      this.setState({ series: series });
    });
  }
  updateSeries = (series, updateKey, seriesKey) => {
    this.setState({
      series: this.state.series.map((x, i) => {
        if (series.length > i) x[updateKey] = series[i][seriesKey];
        return x;
      })
    });
  }
  updateSeries = (series, updateKey, seriesKey) => {
    this.setState({
      series: this.state.series.map((x, i) => {
        if (series.length > i) x[updateKey] = series[i][seriesKey];
        return x;
      })
    });
  }

  removeDataset = (name) => {
    const series = this.state.series.map(s => {
      delete s[name];
      return s;
    });
    this.rebaseline();
    this.setState({ series: series });
  }

  seriesSelector = async () => {
    const { currentSeries, data } = this.state;
    try {
      const newSeries = await get('observations', currentSeries, data.period[0],
        data.period[3], data.period[1], data.period[2]);
      const found = this.state.seriesDetails
        .find(x => x.key === `${currentSeries}Mean`);
      if (!found) {
        this.setState({
          seriesDetails: [{ name: currentSeries, key: `${currentSeries}Mean` },
            ...this.state.seriesDetails]
        });
      }
      const largestDataset = newSeries.length < this.state.series.length
        ? this.state.series : newSeries;
      const series = largestDataset.map((x, i) => {
        let res = this.state.series[i] ? { ...this.state.series[i] } : {};
        res['year'] = this.state.series[i]
          ? this.state.series[i].year : newSeries[i].year;
        if (newSeries[i]) res[`${currentSeries}Mean`] = newSeries[i].mean;
        return res;
      });
      this.setState({
        series: series,
        chips: [currentSeries, ...this.state.chips]
      });
    } catch (e) {
      // TODO: deal with errors
    }
  };
  modelSelector = async () => {
    const { currentModel, data } = this.state;
    try {
      const newModel = await get('models',
        currentModel, data.period[0], data.period[3], data.period[1],
        data.period[2], '?upperBound=95&lowerBound=5');
      if (!this.state.modelDetails
        .find(x => x.key === `${currentModel}Range`)) {
        this.setState({
          modelDetails: [{
            name: currentModel,
            key: `${currentModel}Range`
          }, ...this.state.modelDetails]
        });
      }

      const largestDataset = newModel.length < this.state.series.length
        ? this.state.series : newModel;
      const series = largestDataset.map((x, i) => {
        let res = this.state.series[i] ? { ...this.state.series[i] } : {};
        res['year'] = this.state.series[i]
          ? this.state.series[i].year : newModel[i].year;
        res[`${currentModel}Range`] = [
          newModel[i].data[0].mean, newModel[i].data[1].mean
        ];
        return res;
      });
      this.setState({
        series: series,
        chips: [currentModel, ...this.state.chips]
      });
    } catch (e) {
      // TODO: deal with errors
    }
  }
  calculatePercent = (a, b) => {
    return Math.floor((a - b) / 30 * 100);
  }
  periodChange = values => {
    if (this.state.pTimeout) clearTimeout(this.state.pTimeout);
    const timeout = setTimeout(this.rebaseline, 500);
    const p = this.calculatePercent(values[2], values[1]);
    const e = p < 40 ? 'Low baselines skew data' : '';
    this.setState({
      trackColor: greenToRed(p),
      error: e,
      data: {
        period: values,
        min: this.state.data.min,
        max: this.state.data.max
      },
      pTimeout: timeout
    });
  }

  render () {
    const handlers = {
      seriesHandler: this.seriesHandler,
      seriesSelector: this.seriesSelector,
      modelHandler: this.modelHandler,
      modelSelector: this.modelSelector,
      periodChange: this.periodChange,
      removeChip: this.removeChip
    };
    return (
      <div>
        <Graph
          styles={{ float: 'left', width: '55vw', margin: '1em 0 0 1em' }}
          title='Select Series to add to Graph'
          series={this.state.series}
          config={this.state.chart}
        >
          {
            this.state.modelDetails.map((x, i) => (
              <Area
                key={x.name}
                fill={`#${this.state.modelColors[i]}`}
                stroke={`#${this.state.modelColors[i]}`}
                isAnimationActive={false}
                type='linear'
                name={x.name}
                dataKey={x.key}
              />
            ))
          }
          {
            this.state.seriesDetails.map((x, i) => (
              <Line
                key={i}
                dot={false}
                stroke={`#${this.state.seriesColors[i + 1]}`}
                activeDot
                isAnimationActive={false}
                type='linear'
                name={x.name}
                dataKey={x.key}
                strokeWidth={2}
              />
            ))
          }
        </Graph>
        <GraphController
          trackColor={this.state.trackColor}
          style={{
            float:'right',
            height: '70vh',
            width: '40vw',
            margin: '1em 1em 0 0'
          }}
          handlers={handlers}
          series={this.state.serieNames}
          models={this.state.modelNames}
          chips={this.state.chips}
          currentModel={this.state.currentModel}
          currentSeries={this.state.currentSeries}
          data={this.state.data}
        >
          {this.state.error.length === 0
            ? null : <ErrorWarning text={this.state.error} />}
        </GraphController>
      </div>
    );
  }
}

export default Graphs;
