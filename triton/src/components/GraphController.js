import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const GraphController = ({ currentSeries, series, handlers, baseline, data, style }) => {
  // const { baselineChange, periodChange } = handlers;
  const {
    seriesHandler,
    seriesSelector,
    baselineChange,
    periodChange
  } = handlers;
  return (
    <Paper style={style} zDepth={1}>
      <div style={{ width: '100%' }}>
        <DropDownMenu value={currentSeries} onChange={seriesHandler}>
          {series.map((s, i) => <MenuItem key={i} value={s} primaryText={s} />)}
        </DropDownMenu>
        <FlatButton label='Add Series' onClick={seriesSelector}
        />
      </div>
      <Divider />
      <div style={{ width:'80%', marginLeft: '10%' }}>
        <Range min={data.min} max={data.max} defaultValue={data.period} onChange={periodChange} style={{ marginTop: '3%' }} />
        <Range min={baseline.min} max={baseline.max} defaultValue={baseline.period} onChange={baselineChange} style={{ marginTop: '3%' }} />
      </div>
    </Paper>
  );
};

GraphController.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.string)
};

export default GraphController;
