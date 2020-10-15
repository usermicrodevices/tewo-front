/* eslint react/no-array-index-key: off */
import React from 'react';
import { inject, observer } from 'mobx-react';
import Loader from 'elements/loader';

import style from './chart.module.scss';

const Chart = inject('storage')(observer(({ storage: { chart } }) => {
  if (typeof chart === 'undefined') {
    return <Loader size="large" />;
  }
  let max = 0;
  for (const datum of chart) {
    max = Math.max(datum, max);
  }
  return (
    <div className={style.chart}>
      {
        chart.map((v, id) => (
          <div key={id} className={style.column}>
            <div className={style.value} style={{ height: `${(max ? v / max : 0) * 100}%` }} />
            <div className={style.tooltip}>{v}</div>
          </div>
        ))
      }
    </div>
  );
}));

export default Chart;
