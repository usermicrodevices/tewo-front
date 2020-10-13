import React from 'react';
import { inject, observer } from 'mobx-react';

import Heatmap from 'elements/chart/heatmap';
import Loader from 'elements/loader';

import classnames from './index.module.scss';

function Legend() {
  return <div>Legend</div>;
}

const Chart = inject('storage')(observer(({
  storage,
}) => {
  const { isLoaded, chartData } = storage;
  const legend = [{
    from: 1,
    to: 1,
    name: 'Активно',
    color: '#00A100',
  }];

  if (!isLoaded) {
    return <Loader size="large" />;
  }

  return (
    <div className={classnames.root}>
      <Heatmap legend={legend} data={chartData} />
      <Legend />
      <div>
        Оборудования найдено:
        {chartData.length}
      </div>
    </div>
  );
}));

export default Chart;
