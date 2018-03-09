import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const GraphController = ({ dataset, datasets, model, models, handlers, baselinePeriod, dataPeriod, style }) => {
  // const { baselineChange, periodChange } = handlers;
  const { datasetMenuHandler, modelMenuHandler } = handlers;
  return (
    <Paper style={style} zDepth={2}>
      <div style={{ width: '100%' }}>
        <DropDownMenu value={dataset} onChange={datasetMenuHandler}>
          {datasets.map((d, i) => <MenuItem value={d} primaryText={d} />)}
        </DropDownMenu>
        <DropDownMenu value={model} onChange={modelMenuHandler}>
          {models.map((m, i) => <MenuItem value={m} primaryText={m} />)}
        </DropDownMenu>
      </div>
      <div style={{ width:'100%' }} />
    </Paper>
  );
};

GraphController.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.string)
};

export default GraphController;
