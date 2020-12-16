import React from 'react';
import { inject, observer } from 'mobx-react';
import { withSize } from 'react-sizeme';

import SimpleCurve from 'elements/chart/simpleCurve';
import Format from 'elements/format';
import Loader from 'elements/loader';
import ChnagesLabel from 'elements/changesLabel';

import classnames from './index.module.scss';

const ChartBeveragesHeader = ({ diff, current }) => (
  <div className={classnames.header}>
    <h2>
      <Format>{current}</Format>
    </h2>
    <ChnagesLabel value={diff} />
  </div>
);

const ChartBeverages = ({ storage }) => {
  const {
    chartData, currentBeverages, labels, isLoaded,
    beveragesDiff,
  } = storage;

  const contentElement = isLoaded ? (
    <>
      <ChartBeveragesHeader diff={beveragesDiff} current={currentBeverages} />
      <div className={classnames.chart}>
        <SimpleCurve data={chartData} name="Наливы" labels={labels} color="#0180E1" />
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

export default withSize()(inject('storage')(observer(ChartBeverages)));
