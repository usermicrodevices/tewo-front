import React from 'react';
import { inject, observer } from 'mobx-react';

import CurvesPicker from 'elements/curvePicker';
import ScalebleChart from 'elements/chart/scaleble';
import Loader from 'elements/loader';

import classnames from './index.module.scss';

const Chart = inject('storage')(observer(({
  storage,
}) => {
  if (typeof storage.beveragesStats === 'undefined') {
    return <div className={classnames.root}><Loader /></div>;
  }
  const {
    beveragesStats: {
      isSeriesLoaded,
      series,
      xSeria,
    },
    properties,
  } = storage;
  if (!isSeriesLoaded) {
    return <Loader size="large" />;
  }
  return (
    <div className={classnames.root}>
      <CurvesPicker imputsManager={properties} />
      <ScalebleChart
        y={series}
        x={xSeria}
        height={290}
        y1={[
          { text: 'Наливов в день, шт.', decimalsInFloat: 0, tooltipUnit: 'шт.' },
          { text: 'Динамика продаж, ₽', decimalsInFloat: 2, tooltipUnit: '₽' },
        ][series[0].axis]}
      />
    </div>
  );
}));

export default Chart;
