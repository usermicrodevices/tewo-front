import { when } from 'mobx';
import momentJS from 'moment';

import { get } from 'utils/request';
import { isDateRange, stepToPast, daterangeToArgs } from 'utils/date';
import checkData from 'utils/dataCheck';
import SalesRow from 'models/comerce/salesRow';
import BeveragesStats from 'models/beverages/stats';
import apiCheckConsole from 'utils/console';
import PrimeCostRow from 'models/comerce/primecostRow';

import { getSalesTop } from './salePoints';
import { BEVERAGES_SALE_POINTS_STATS, getBeveragesDense } from './beverage';

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
  return new BeveragesStats(
    [...result.values()]
      .sort((a, b) => (a.moment > b.moment ? 1 : -1))
      .map((itm) => ({
        ...itm,
        moment: momentJS(itm.moment),
      })),
  );
};

const salesLoader = (session, filter, commitChartData) => () => {
  const curRange = filter.data.get('device_date');
  const prwRange = isDateRange(curRange) ? stepToPast(curRange) : [];
  const search = filter.searchSkip(new Set(['device_date']));
  /*
  if (process.env.NODE_ENV !== 'production') {
    const count = 110;
    return Promise.resolve({
      count,
      results: new Array(count).fill(null).map((_, id) => new SalesRow(
        session,
        filter,
        id,
        { beverages: Math.random() * 100000, sales: Math.random() * 100000 },
        { beverages: Math.random() * 100000, sales: Math.random() * 100000 },
      )),
    });
  }// */
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
          apiCheckConsole.error(`ожидается массив в качестве значения для девайса в эндпоинте ${BEVERAGES_SALE_POINTS_STATS.link}`);
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

const getPrimecost = (session, chartDataAcceptor) => (_, __, search) => Promise.all([
  when(() => session.points.isLoaded).then(() => session.points.rawData),
  getBeveragesDense(search).then((response) => {
    chartDataAcceptor(response);
    return response;
  }),
]).then(([salePoints, response]) => {
  chartDataAcceptor(response);
  const map = {};
  for (const { id: pointId, cityId } of salePoints.filter(({ id }) => response.has(id))) {
    if (!(cityId in map)) {
      map[cityId] = {};
    }
    map[cityId][pointId] = response.get(pointId);
  }
  const results = Object.entries(map).map(([cityId, data]) => {
    let cityEarn = 0;
    let cityCost = 0;
    const details = {};
    for (const [salePointId, drinks] of Object.entries(data)) {
      let pointEarn = 0;
      let pointCost = 0;
      const granddetails = {};
      for (const [drinkId, drinkData] of drinks.entries()) {
        const {
          count,
          sum,
          ingredients,
        } = drinkData;
        let drinkCost = 0;
        const ingredientsResult = {};
        for (const [ingredientId, ingredient] of ingredients.entries()) {
          ingredientsResult[ingredientId] = {
            ...ingredient,
            id: ingredientId,
          };
          drinkCost += ingredient.cost;
        }
        pointEarn += sum;
        pointCost += drinkCost;
        granddetails[drinkId] = {
          earn: sum,
          cost: drinkCost,
          margin: sum - drinkCost,
          count,
          id: drinkId,
          details: ingredientsResult,
        };
      }
      cityEarn += pointEarn;
      cityCost += pointCost;
      details[salePointId] = {
        earn: pointEarn,
        margin: pointEarn - pointCost,
        id: parseInt(salePointId, 10),
        details: granddetails,
      };
    }
    const sophiesticatedData = {
      earn: cityEarn,
      margin: cityEarn - cityCost,
      id: parseInt(cityId, 10),
      details,
    };
    return new PrimeCostRow(parseInt(cityId, 10), sophiesticatedData, session);
  });
  return {
    count: results.length,
    results,
  };
});

export { salesLoader, salesDetails, getPrimecost };
