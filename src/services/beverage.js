import moment from 'moment';
import { when } from 'mobx';

import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import {
  daterangeToArgs, isDateRange, alineDates, momentToArg,
} from 'utils/date';
import Beverage from 'models/beverages/beverage';
import BeveragesStats from 'models/beverages/stats';
import apiCheckConsole from 'utils/console';

const getBeverages = (session) => (limit, offset = 0, filter = '') => new Promise((resolve, reject) => {
  apiCheckConsole.assert(limit >= 0 && offset >= 0, `Неверные параметры запроса наливов "${limit}" "${offset}"`);
  get(`/data/beverages/?limit=${limit}&offset=${offset || 0}${filter !== '' ? `&${filter}` : filter}`).then((response) => {
    const beverageMustBe = {
      id: 'number',
      cid: 'string',
      created_date: 'date',
      device_date: 'date',
      device: 'number',
      sale_sum: 'number',
      canceled: 'boolean',
      cost: 'number',
      sale_sum_hidden: 'number',
    };
    const mayBe = {
      drink: 'number',
      operation: 'number',

      code_authorization: 'any',
      card_type: 'any',
      mask_card: 'any',
      link: 'any',
      seller: 'any',
      terminal: 'any',
      check_num: 'any',
      state: 'any',
      time_stamp_transaction: 'any',
      qrcode: 'any',
      card: 'any',
      commission: 'any',
    };
    checkData(response, {
      count: 'number',
      results: 'array',
    }, {
      next: 'string',
      previous: 'string',
    }, {
      results: (beverages) => {
        for (const beverage of beverages) {
          if (!checkData(beverage, beverageMustBe, mayBe)) {
            apiCheckConsole.error('провален тест для объекта', beverage, beverages);
            return false;
          }
        }
        return true;
      },
    });

    resolve({
      count: response.count,
      results: response.results.map((datum) => {
        const beverage = new Beverage(session);
        beverage.id = datum.id;
        beverage.cid = datum.cid;
        beverage.createdDate = moment(datum.created_date);
        beverage.deviceDate = moment(datum.device_date);
        beverage.deviceId = datum.device;
        beverage.drinkId = datum.drink;
        beverage.operationId = datum.operation;
        beverage.saleSum = datum.sale_sum / 100;
        beverage.canceled = datum.canceled;
        return beverage;
      }),
    });
  }).catch(reject);
});

const getBeverageOperations = (map) => get('refs/operations/').then((data) => {
  if (Array.isArray(data)) {
    for (const datum of data) {
      if (!checkData(datum, { id: 'number', value: 'string', description: 'string' })) {
        apiCheckConsole.error('Неожиданные данные для операций refs/operations/', datum);
      }
      map.set(datum.id, datum.description);
    }
  }
  return map;
});

const getBeveragesStats = (daterange, filters, step) => {
  const rangeArg = daterangeToArgs(daterange, 'device_date') || `&device_date__gt=${momentToArg(moment(1))}`;
  const location = `/data/beverages/stats/?step=${step}${rangeArg}${filters ? `&${filters}` : ''}`;
  const mustBe = {
    moment: 'date',
    total: 'number',
    sum: 'number',
  };
  return get(location).then((result) => {
    if (!Array.isArray(result)) {
      apiCheckConsole.error(`can not get data from ${location}`, result);
      return new BeveragesStats([]);
    }
    for (const d of result) {
      if (!checkData(d, mustBe)) {
        apiCheckConsole.error(`Неожиданные данные для эндпоинта ${location}`, d);
      }
    }
    const isRangeGiven = isDateRange(daterange);
    if (!isRangeGiven && result.length === 0) {
      return new BeveragesStats([]);
    }
    const finalDateRange = isRangeGiven
      ? daterange
      : [moment(result[moment(result[0].moment) > 0 ? 0 : 1].moment), moment(result[result.length - 1].moment)];
    return new BeveragesStats([...alineDates(
      finalDateRange,
      step,
      result,
      (item) => (
        item ? {
          beverages: item.total,
          sales: item.sum / 100,
        } : { beverages: 0, sales: 0 }
      ),
    )]);
  });
};

const BEVERAGES_SALE_POINTS_STATS = {
  mustBe: {
    moment: 'date',
    total: 'number',
    sum: 'number',
  },
  link: '/data/beverages/sale_points_stats/',
};

const getBeveragesSalePointsStats = (dateRange, step, salePoints) => {
  const rangeArg = daterangeToArgs(dateRange, 'device_date');
  let lnk = `${BEVERAGES_SALE_POINTS_STATS.link}?step=${step}${rangeArg}`;
  if (Array.isArray(salePoints)) {
    if (salePoints.length === 1) {
      lnk = `${lnk}&device__sale_point__id=${salePoints[0]}`;
    }
    if (salePoints.length > 1) {
      lnk = `${lnk}&device__sale_point__id__in=${salePoints}`;
    }
  }
  return get(lnk).then((json) => {
    const result = {};
    for (const [salePointId, arr] of Object.entries(json)) {
      if (!Array.isArray(arr)) {
        apiCheckConsole.error(`${lnk} ожидается массив, получен`, arr);
      } else {
        result[salePointId] = [];
        for (const datum of arr) {
          checkData(datum, BEVERAGES_SALE_POINTS_STATS.mustBe);
        }
        result[salePointId] = [...alineDates(
          dateRange,
          step,
          arr,
          (item) => (
            item ? {
              beverages: item.total,
              sales: item.sum / 100,
            } : { beverages: 0, sales: 0 }
          ),
        )];
      }
    }
    return result;
  });
};

const getBeveragesDense = (search) => {
  const location = `/data/beverages/spoints_ingredients/${search ? `?${search}` : ''}`;
  return get(location).then((rawData) => {
    const result = new Map();
    if (typeof rawData !== 'object') {
      apiCheckConsole.error(`${location} ожидается объект, получен`, rawData);
      return {};
    }
    for (const [pointId, pointRawData] of Object.entries(rawData)) {
      if (typeof pointRawData !== 'object') {
        apiCheckConsole.error(`${location} ожидается объект в качестве описания точки продажи, получен`, pointRawData);
        return {};
      }
      const drinks = new Map();
      result.set(parseInt(pointId, 10), drinks);
      for (const [drinkId, drinkRawData] of Object.entries(pointRawData)) {
        if (!checkData(drinkRawData, {
          drinks_count: 'number',
          ingredients: 'object',
          sum: 'number',
        })) {
          apiCheckConsole.error(`${location} неожиданный объект в качестве описания напитка`, drinkRawData);
          return {};
        }
        const drink = {
          count: drinkRawData.drinks_count,
          sum: drinkRawData.sum / 100,
          ingredients: new Map(),
        };
        drinks.set(parseInt(drinkId, 10), drink);
        for (const [ingredientId, ingredientData] of Object.entries(drinkRawData.ingredients)) {
          if (!checkData(ingredientData, {
            ingredients_count: 'number',
            cost: 'number',
          })) {
            apiCheckConsole.error(`${location} неожиданный объект в качестве описания ингредиента`, ingredientData);
            return {};
          }
          drink.ingredients.set(parseInt(ingredientId, 10), {
            count: ingredientData.ingredients_count,
            cost: ingredientData.cost / 100,
          });
        }
      }
    }
    return result;
  });
};

const beveragesDenseToPrimeCostChartChar = (session, chartData) => {
  const DRINKS_AMOUNT = 6;
  const result = {};
  for (const drinks of chartData.values()) {
    for (const [drinkId, drink] of drinks.entries()) {
      if (!(drinkId in result)) {
        result[drinkId] = {
          name: session.drinks.get(drinkId)?.name,
          margin: 0,
          data: {},
        };
      }
      const datum = result[drinkId];
      datum.margin += drink.sum;
      for (const [ingredientId, { cost }] of drink.ingredients.entries()) {
        datum.data[ingredientId] = (datum.data[ingredientId] || 0) + cost;
        datum.margin -= cost;
      }
    }
  }
  const orderedResult = Object.entries(result).sort(([, { margin: a }], [, { margin: b }]) => b - a).slice(0, DRINKS_AMOUNT);
  const categories = orderedResult.slice(0, DRINKS_AMOUNT).map(([drinkId]) => session.drinks.get(parseInt(drinkId, 10))?.name);
  const usedIngredientsSet = new Set();
  for (const [, { data }] of orderedResult) {
    for (const ingredientId of Object.keys(data)) {
      usedIngredientsSet.add(parseInt(ingredientId, 10));
    }
  }
  const usedIngredientsIds = [...usedIngredientsSet.values()];
  const series = usedIngredientsIds.map((id) => ({
    name: session.ingredients.get(id)?.name,
    data: new Array(orderedResult.length),
  }));
  series.push({
    name: 'Прибыль',
    data: new Array(orderedResult.length),
  });
  for (const [ingredientIndex, ingredientId] of usedIngredientsIds.entries()) {
    const seria = series[ingredientIndex];
    for (const [drinkIndex, [, { data }]] of orderedResult.entries()) {
      seria.data[drinkIndex] = data[ingredientId] || 0;
    }
  }
  for (const [drinkIndex, [, { margin }]] of orderedResult.entries()) {
    series[series.length - 1].data[drinkIndex] = margin;
  }
  return {
    categories,
    series,
  };
};

const getBeveragesDenseChart = (search, session) => Promise.all([
  getBeveragesDense(search),
  when(() => session.drinks.isLoaded),
  when(() => session.ingredients.isLoaded),
]).then(([chartData]) => (
  beveragesDenseToPrimeCostChartChar(session, chartData)
));

export {
  getBeverages,
  getBeverageOperations,
  getBeveragesStats,
  getBeveragesSalePointsStats,
  getBeveragesDense,
  beveragesDenseToPrimeCostChartChar,
  getBeveragesDenseChart,
  BEVERAGES_SALE_POINTS_STATS,
};
