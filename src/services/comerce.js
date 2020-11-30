import { get } from 'utils/request';
import { isDateRange, stepToPast, daterangeToArgs } from 'utils/date';
import checkData from 'utils/dataCheck';
import SalesRow from 'models/comerce/salesRow';
import momentJS from 'moment';

import BeveragesStats from 'models/beverages/stats';

import { getSalesTop } from './salePoints';
import { BEVERAGES_SALE_POINTS_STATS } from './beverage';

const sumRow = (arr) => {
  const result = {
    beverages: 0,
    sales: 0,
  };
  if (Array.isArray(arr)) {
    for (const json of arr) {
      checkData(json, BEVERAGES_SALE_POINTS_STATS.mustBe);
      result.beverages += json.total;
      result.sales += json.sum;
    }
  }
  return result;
};

const joinToChart = (data) => {
  const result = new Map();
  for (const arr of Object.values(data)) {
    if (Array.isArray(arr)) {
      for (const { moment, total, sum } of arr) {
        if (!result.has(moment)) {
          result.set(moment, {
            moment,
            beverages: 0,
            sales: 0,
          });
        }
        const itm = result.get(moment);
        itm.beverages += total;
        itm.sales += sum;
      }
    }
  }
  return new BeveragesStats([...result.values()].sort((a, b) => {
    if (a === b) {
      return 0;
    }
    return a.moment > b.moment ? 1 : -1;
  }).map((itm) => ({
    ...itm,
    moment: momentJS(itm.moment),
  })));
};

const salesLoader = (session, filter, commitChartData) => () => {
  const curRange = filter.data.get('device_date');
  const prwRange = isDateRange(curRange) ? stepToPast(curRange) : [];
  const search = filter.searchSkip(new Set(['device_date']));
  /*
  return Promise.resolve({
    count: 10,
    results: new Array(10).fill(null).map((_, id) => new SalesRow(
      session,
      filter,
      id,
      { beverages: Math.random() * 100000, sales: Math.random() * 100000 },
      { beverages: Math.random() * 100000, sales: Math.random() * 100000 },
    )),
  });
  // */
  return Promise.all(
    [curRange, prwRange].map((dateRange) => {
      const rangeArg = daterangeToArgs(dateRange, 'device_date');
      const lnk = `${BEVERAGES_SALE_POINTS_STATS.link}?step=86400${search ? `&${search}` : ''}${rangeArg}`;
      return get(lnk);
    }),
  ).then(([cur, prw]) => {
    const elements = Object.entries(cur);
    commitChartData(joinToChart(cur), joinToChart(prw));
    return {
      count: elements.length,
      results: elements.map(([salePointId, json]) => {
        if (!Array.isArray(json)) {
          console.error(`ожидается массив в качестве значения для девайса в эндпоинте ${BEVERAGES_SALE_POINTS_STATS.link}`);
        }
        return new SalesRow(session, filter, parseInt(salePointId, 10), sumRow(json), sumRow(prw[salePointId]));
      }),
    };
  });
};

const salesDetails = (salePointId, filter) => {
  const curRange = filter.data.get('device_date');
  const prwRange = isDateRange(curRange) ? stepToPast(curRange) : [];
  const search = filter.searchSkip(new Set(['device_date']));
  return Promise.all(
    [curRange, prwRange].map((dateRange) => {
      const rangeArg = daterangeToArgs(dateRange, 'device_date');
      return getSalesTop(`device__sale_point__id=${salePointId}${search ? `&${search}` : ''}${rangeArg}`);
    }),
  );
};

export { salesLoader, salesDetails };
