/* eslint no-param-reassign: off */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Divider } from 'antd';
import classNames from 'classnames';

import DatergangePicker from 'elements/filters/daterangepicker';
import Icon from 'elements/icon';
import Loader from 'elements/loader';
import Format from 'elements/format';

import CurvesPicker from './salesCurvePicker';
import Chart from './chart';

import styles from './sales.module.scss';

const ChangesLabel = ({ value }) => {
  if (typeof value !== 'number') {
    return <div className={styles.growth}><Loader /></div>;
  }
  if (value === 0) {
    return null;
  }
  return (
    <div className={styles.growth}>
      { <Icon name={value > 0 ? 'arrow-upward-outline' : 'arrow-downward-outline'} className={value > 0 ? styles.rise : styles.fail} /> }
      {`${Math.round(value)}%`}
    </div>
  );
};

const Sales = ({ element: { details } }) => {
  const {
    salesDiff,
    beveragesDiff,
    curBeverages,
    prwBeverages,
    curSales,
    prwSales,
  } = details;
  const isLoaded = details.isSeriesLoaded;
  return (
    <Card className={styles.root}>
      <div className={styles.chart}>
        <div className={styles.filters}>
          <DatergangePicker title="Период" value={details.dateRange} onChange={(v) => { details.dateRange = v; }} />
          <CurvesPicker />
        </div>
        <div className={styles.curves}>
          {
            isLoaded
              ? <Chart />
              : <Loader size="large" />
          }
        </div>
      </div>
      <div className={styles.sider}>
        <div className={styles.sidertitle}>
          <span className={styles.curency}>₽</span>
          <span>Статистика продаж</span>
        </div>
        <div className={styles.rangereport}>
          <div className={styles.values}>
            <div><Format>{curSales}</Format></div>
            <ChangesLabel value={salesDiff} />
          </div>
          <div className={styles.sublabel}>продаж за текущий период</div>
        </div>
        <div className={classNames(styles.rangereport, styles.prew)}>
          <div className={styles.values}>
            <div><Format>{prwSales}</Format></div>
          </div>
          <div className={styles.sublabel}>продаж за предыдущий период</div>
        </div>
        <Divider />
        <div className={styles.beverages}>
          <div className={styles.values}>
            <div className={styles.sublabel}>Колличество наливов</div>
            <ChangesLabel value={beveragesDiff} />
          </div>
          <div className={styles.amount}>
            <div className={styles.value}><Format>{curBeverages}</Format></div>
            <div className={styles.sublabel}>текущий</div>
          </div>
          <div className={styles.amount}>
            <div className={styles.value}><Format>{prwBeverages}</Format></div>
            <div className={styles.sublabel}>предыдущий</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default inject('element')(observer(Sales));
