import { get } from 'utils/request';
import { isDateRange, stepToPast, daterangeToArgs } from 'utils/date';
import { BEVERAGES_SALE_POINTS_STATS } from './beverage';

const salesLoader = (session, filter) => () => {
  const curRange = filter.data.get('device_date');
  const prwRange = isDateRange(curRange) ? stepToPast(curRange) : [];
  filter.set('device_date', null);
  const { search } = filter;
  filter.set('device_date', curRange);
  return Promise.all(
    [curRange, prwRange].map((dateRange) => {
      const rangeArg = daterangeToArgs(dateRange, 'device_date');
      const lnk = `${BEVERAGES_SALE_POINTS_STATS.link}?step=86400&${search}${rangeArg}`;
      console.log('lnk', lnk, filter.data);
      return get(lnk);
    }),
  ).then(([cur, prw]) => {
    console.log(cur, prw);
    return {
      count: 0,
      results: [],
    };
  });
};

export default salesLoader;
