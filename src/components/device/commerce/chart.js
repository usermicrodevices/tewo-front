import React from 'react';
import { inject, observer } from 'mobx-react';

import Loader from 'elements/loader';
import ScalebleChart from 'elements/chart/scaleble';

import ChartWrapper from '../chartWrapper';

const Chart = ({ element: { details: { beveragesStats: { series, xSeria, isSeriesLoaded } } } }) => (
  <ChartWrapper withCurvepicker>
    { isSeriesLoaded ? (
      (() => {
        const y1 = [
          { text: 'Наливов в день', decimalsInFloat: 0 },
          { text: 'Динамика продаж, ₽', decimalsInFloat: 2 },
        ][series[0].axis];
        return (
          <ScalebleChart
            y={series}
            x={xSeria}
            height={314}
            y1={y1}
          />
        );
      })()
    ) : <Loader size="large" /> }
  </ChartWrapper>
);

export default inject('element')(observer(Chart));
