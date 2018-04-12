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
import './GraphController.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const GraphController = ({
  trackColor, currentSeries, currentModel, series,
  models, handlers, baseline, data, style, children
}) => {
  const {
    seriesHandler,
    seriesSelector,
    modelHandler,
    modelSelector,
    periodChange
  } = handlers;
  return (
    <Paper style={style} zDepth={1}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <DropDownMenu value={currentSeries} onChange={seriesHandler}>
          {series.map((s, i) => <MenuItem key={i} value={s} primaryText={s} />)}
        </DropDownMenu>
        <FlatButton label='Add Series' onClick={seriesSelector} />
        <DropDownMenu value={currentModel} onChange={modelHandler}>
          {models.map((s, i) => <MenuItem key={i} value={s} primaryText={s} />)}
        </DropDownMenu>
        <FlatButton label='Add Model' onClick={modelSelector} />
      </div>
      <Divider />
      <div style={{ width:'80%', margin: '2% 10% 2% 5%' }}>
        <Range
          allowCross={false}
          min={data.min}
          max={data.max}
          defaultValue={data.period}
          onChange={periodChange}
          style={{ marginTop: '3%' }}
          trackStyle={[{}, { backgroundColor: trackColor }, {}]}
        />
      </div>
      <Divider />
      { children }
    </Paper>
  );
};

GraphController.propTypes = {
  trackColor: PropTypes.string.isRequired,
  currentSeries: PropTypes.string.isRequired,
  currentModel: PropTypes.string.isRequired,
  series: PropTypes.arrayOf(PropTypes.string),
  models: PropTypes.arrayOf(PropTypes.string),
  handlers: PropTypes.object,
  baseline: PropTypes.object,
  data: PropTypes.object,
  style: PropTypes.object
};

export default GraphController;
