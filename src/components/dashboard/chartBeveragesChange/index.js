import React from 'react';
import { inject, observer } from 'mobx-react';

import Multycurve from 'elements/chart/multycurve';
import Loader from 'elements/loader';

import classes from './index.module.scss';

const Chart = inject('storage')(observer(({ storage }) => {
  if (!storage.isLoaded) {
    return <div className={classes.root}><Loader /></div>;
  }
  const { xSeria, series } = storage;
  return (
    <div className={classes.root}>
      <Multycurve
        height={530}
        x={xSeria}
        y={series}
        y1={{ text: 'Наливов в день', decimalsInFloat: 0 }}
      />
    </div>
  );
}));

export default Chart;
