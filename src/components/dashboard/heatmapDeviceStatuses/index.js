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
  const { isLoaded, devices } = storage;

  if (!isLoaded) {
    return <Loader size="large" />;
  }

  return (
    <div className={classnames.root}>
      <Heatmap />
      <Legend />
      <div>
        Оборудования найдено:
        {devices.length}
      </div>
    </div>
  );
}));

export default Chart;
