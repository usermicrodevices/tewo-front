import React from 'react';
import { inject, observer } from 'mobx-react';

import Loader from 'elements/loader';
import Multycurve from 'elements/chart/multycurve';

import ChartWrapper from '../chartWrapper';

const ClearanceChart = ({ element: { details: { clearancesChart } } }) => (
  <ChartWrapper>
    { typeof clearancesChart !== 'undefined' && clearancesChart.x !== 'undefined'
      ? (
        <Multycurve
          height={354}
          x={clearancesChart.x}
          y={[
            {
              name: 'Наливы',
              data: clearancesChart.beverages,
              type: 'line',
              axis: 2,
              width: 4,
            },
            {
              name: 'Фактическое число очисток',
              data: clearancesChart.actual,
              type: 'column',
              axis: 1,
              width: 1,
            },
            {
              name: 'Ожидаемое число очисток',
              data: clearancesChart.expected,
              type: 'column',
              axis: 1,
              width: 1,
            },
          ]}
          y1={{ text: 'Очисток в день', decimalsInFloat: 0 }}
          y2={{ text: 'Наливов в день', decimalsInFloat: 0 }}
        />
      )
      : <Loader size="large" /> }
  </ChartWrapper>
);

export default inject('element')(observer(ClearanceChart));
