import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';

import Loader from 'elements/loader';
import ScalebleChart from 'elements/chart/scaleble';
import CurvesPicker from 'elements/curvePicker';
import { SALES_CHART_LABELS } from 'models/detailsProps';

import classes from './index.module.scss';

const Chart = ({
  table: {
    isLoaded, series, xSeria, properties,
  },
}) => (
  <Card className={classes.chartcard}>
    <CurvesPicker imputsManager={properties} />
    <div className={classes.chart}>
      { !isLoaded && <div className={classes.chartloader}><Loader /></div> }
      <ScalebleChart
        y={series}
        x={xSeria}
        height={360}
        y1={SALES_CHART_LABELS[Array.isArray(series) && series.length > 0 ? series[0].axis : 0]}
      />
    </div>
  </Card>
);

export default inject('table')(observer(Chart));
