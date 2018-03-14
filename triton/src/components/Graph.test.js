import React from 'react';
import { shallow, mount } from 'enzyme';
import Test from './Test';
import Graph from './Graph';
import { ComposedChart, Line } from 'recharts';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const actions = [{ label: 'a', href: 'https://tritonclimatetools.herokuapp.com' }, { label: 'b', href: 'abc.com' }];

const baseConfig = {
  minHeight: '100',
  xAxisKey: 'axisKey',
  seriesDetails: [
    { name: 'CMIP3', key: 'range' },
    { name: 'HadCRUT4', key: 'hadcrutMean' },
    { name: 'Cowtan and Way', key: 'cowtanMean' },
    { name: 'GISTEMP', key: 'gistempMean' }]
};

describe('Graph', () => {
  it('Renders without Config', () => {
    const wrapper = shallow(
      <Graph title='' config={baseConfig}>
        <Line />
      </Graph>
    );
    expect(wrapper.find(ComposedChart)).toHaveLength(1);
  });
  it('Renders Card Components', () => {
    const wrapper = mount(
      <Test>
        <Graph title='' config={baseConfig}>
          <Line />
        </Graph>
      </Test>);
    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardActions)).toHaveLength(1);
    expect(wrapper.find(CardMedia)).toHaveLength(1);
    expect(wrapper.find(CardTitle)).toHaveLength(1);
    expect(wrapper.find(CardText)).toHaveLength(1);
    expect(wrapper.find(FlatButton)).toHaveLength(0);
  });
  it('Adds Actions', () => {
    const wrapper = mount(
      <Test>
        <Graph title='' config={baseConfig} actions={actions}>
          <Line />
        </Graph>
      </Test>);
    expect(wrapper.find(FlatButton)).toHaveLength(actions.length);
  });
});
