import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import { lightBlue200 } from 'material-ui/styles/colors';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';
import './GraphController.css';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '1ex'
  },
};

const GraphController = (props) => {
  const {
    trackColor, currentSeries, currentModel, series, chips,
    models, handlers, data, style, children
  } = props;
  const {
    seriesHandler,
    seriesSelector,
    modelHandler,
    modelSelector,
    periodChange,
    removeChip
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
      <div style={styles.wrapper}>
        {chips.map((s, i) =>
          <Chip
            backgroundColor={lightBlue200}
            key={i}
            onRequestDelete={() => removeChip(s)}
            style={styles.chip}
          >{s}</Chip>
        )}
      </div>
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
  chips: PropTypes.arrayOf(PropTypes.string),
  handlers: PropTypes.object,
  data: PropTypes.object,
  style: PropTypes.object
};

export default GraphController;
