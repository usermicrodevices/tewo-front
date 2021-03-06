/* eslint no-param-reassign: off */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Divider } from 'antd';
import classNames from 'classnames';

import DatergangePicker from 'elements/filters/daterangepicker';
import Loader from 'elements/loader';
import Format from 'elements/format';
import Typography from 'elements/typography';
import ChangesLabel from 'elements/changesLabel';
import ScalebleChart from 'elements/chart/scaleble';
import CurvesPicker from 'elements/curvePicker';
import { SALES_CHART_LABELS } from 'models/detailsProps';
import DaterangeTitle from 'elements/chart/daterangeTitle';

import styles from './sales.module.scss';

const Sales = ({ element: { details } }) => {
  const {
    salesDiff,
    beveragesDiff,
    beveragesCur,
    beveragesPrw,
    salesCur,
    salesPrw,
    isSeriesLoaded,
    series,
    xSeria,
  } = details.beveragesStats;
  const { imputsManager } = details;
  const { previousDateRange: prew } = imputsManager;
  return (
    <Card className={styles.root}>
      <div className={styles.chart}>
        <div className={styles.filters}>
          <DatergangePicker title="Период" value={imputsManager.dateRange} onChange={(v) => { imputsManager.dateRange = v; }} />
          <DaterangeTitle announce="Предыдущий период" range={prew} />
          <CurvesPicker imputsManager={imputsManager} />
        </div>
        <div className={styles.curves}>
          {
            isSeriesLoaded
              ? (
                <ScalebleChart
                  y={series}
                  x={xSeria}
                  height={335}
                  y1={SALES_CHART_LABELS[series[0].axis]}
                />
              )
              : <Loader size="large" />
          }
        </div>
      </div>
      <div className={styles.sider}>
        <Typography.Title level={4} className={styles.sidertitle}>
          <span className={styles.curency}>₽</span>
          <span>Статистика продаж</span>
        </Typography.Title>
        <div className={styles.rangereport}>
          <div className={styles.values}>
            <Typography.Value size="xl" strong><Format isCost>{salesCur}</Format></Typography.Value>
            <ChangesLabel value={salesDiff} />
          </div>
          <Typography.Caption>продаж за текущий период</Typography.Caption>
        </div>
        <div className={classNames(styles.rangereport, styles.prew)}>
          <div className={styles.values}>
            <Typography.Value size="l"><Format isCost>{salesPrw}</Format></Typography.Value>
          </div>
          <Typography.Caption>продаж за предыдущий период</Typography.Caption>
        </div>
        <Divider />
        <div className={styles.rangereport}>
          <div className={styles.values}>
            <Typography.Value size="xl" strong><Format>{beveragesCur}</Format></Typography.Value>
            <ChangesLabel value={beveragesDiff} />
          </div>
          <Typography.Caption>наливов за текущий период</Typography.Caption>
        </div>
        <div className={classNames(styles.rangereport, styles.prew)}>
          <div className={styles.values}>
            <Typography.Value size="l"><Format>{beveragesPrw}</Format></Typography.Value>
          </div>
          <Typography.Caption>наливов за предыдущий период</Typography.Caption>
        </div>
      </div>
    </Card>
  );
};

export default inject('element')(observer(Sales));
