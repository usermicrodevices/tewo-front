import React from 'react';
import { inject, observer } from 'mobx-react';

import Loader from 'elements/loader';
import ScalebleChart from 'elements/chart/scaleble';

import ChartWrapper from '../chartWrapper';

const Chart = ({ element: { details: { beveragesStats: { series, xSeria, isSeriesLoaded } } } }) => (
  <ChartWrapper>
    { isSeriesLoaded ? (
      <ScalebleChart
        y={series}
        x={xSeria}
        height={335}
        y2={{ text: 'Динамика продаж, ₽', decimalsInFloat: 2 }}
        y1={{ text: 'Наливов в день', decimalsInFloat: 0 }}
      />
    ) : <Loader size="large" /> }
  </ChartWrapper>
);

export default inject('element')(observer(Chart));
