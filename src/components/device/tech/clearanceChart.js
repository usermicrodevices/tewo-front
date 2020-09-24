import React from 'react';
import { inject, observer } from 'mobx-react';

import Loader from 'elements/loader';
import ClearanceChartWidget from 'elements/chart/clearanceChart';

import ChartWrapper from '../chartWrapper';

const ClearanceChart = ({ element: { details: { beveragesStats: { series, xSeria, isSeriesLoaded } } } }) => (
  <ChartWrapper>
    { isSeriesLoaded
      ? (
        <ClearanceChartWidget height={200} />
      )
      : <Loader size="large" /> }
  </ChartWrapper>
);

export default inject('element')(observer(ClearanceChart));
