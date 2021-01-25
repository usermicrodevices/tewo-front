import React from 'react';
import { inject, observer } from 'mobx-react';

import Loader from 'elements/loader';
import Chart from 'elements/chart/primecostchart';

import classnames from './index.module.scss';

const chartCost = inject('storage')(observer(({
  storage,
}) => {
  if (typeof storage.chart === 'undefined') {
    return <div className={classnames.root}><Loader /></div>;
  }
  return (
    <div className={classnames.root}>
      <Chart chart={storage.chart} />
    </div>
  );
}));

export default chartCost;
