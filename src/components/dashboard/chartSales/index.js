import React from 'react';
import { inject, observer } from 'mobx-react';

import SimpleCurve from 'elements/chart/simpleCurve';
import Format from 'elements/format';
import Loader from 'elements/loader';
import ChangesLabel from 'elements/changesLabel';

import classnames from './index.module.scss';

const ChartSalesHeader = ({ diff, current }) => (
  <div className={classnames.header}>
    <h2>
      <Format>{current}</Format>
    </h2>
    <ChangesLabel value={diff} />
  </div>
);

const ChartSales = ({ storage }) => {
  const {
    chartData, currentSales, labels, isLoaded,
    salesDiff,
  } = storage;

  const contentElement = isLoaded ? (
    <>
      <ChartSalesHeader diff={salesDiff} current={currentSales} />
      <div className={classnames.chart}>
        <SimpleCurve data={chartData} name="Продажи" labels={labels} color="#4CD964" />
      </div>
    </>
  ) : (
    <div className={classnames.loaderContainer}>
      <Loader size="large" />
    </div>
  );

  return (
    <div className={classnames.root}>
      {contentElement}
    </div>
  );
};

export default inject('storage')(observer(ChartSales));
