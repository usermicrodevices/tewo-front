import moment from 'moment';

import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import { daterangeToArgs, isDateRange } from 'utils/date';
import Beverage from 'models/beverages/beverage';
import BeveragesStats from 'models/beverages/stats';

const getBeverages = (session) => (limit, offset = 0, filter = '') => new Promise((resolve, reject) => {
  console.assert(limit >= 0 && offset >= 0, `Неверные параметры запроса наливов "${limit}" "${offset}"`);
  get(`/data/beverages/?limit=${limit}&offset=${offset || 0}${filter !== '' ? `&${filter}` : filter}`).then((response) => {
    const beverageMustBe = {
      id: 'number',
      cid: 'string',
      created_date: 'date',
      device_date: 'date',
      device: 'number',
      drink: 'number',
      sale_sum: 'number',
      canceled: 'boolean',
    };
    const mayBe = {
      operation: 'number',
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
            console.error('провален тест для объекта', beverage, beverages);
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
        console.error('Неожиданные данные для операций refs/operations/', datum);
      }
      map.set(datum.id, datum.description);
    }
  }
  return map;
});

const getBeveragesStats = (pointId, daterange, kind) => {
  const rangeArg = daterangeToArgs(daterange, 'device_date');
  const location = `/data/beverages/stats/?${kind}=${pointId}${rangeArg}`;
  const mustBe = {
    day: 'date',
    total: 'number',
    sum: 'number',
  };
  return get(location).then((result) => {
    if (!Array.isArray(result)) {
      console.error(`can not ger data from ${location}`, result);
      return [];
    }
    for (const d of result) {
      if (!checkData(d, mustBe)) {
        console.error(`Неожиданные данные для эндпоинта ${location}`, d);
      }
    }
    const isRangeGiven = isDateRange(daterange);
    if (!isRangeGiven && result.length === 0) {
      return [];
    }
    function* g([curDay, lastDay]) {
      while (curDay <= lastDay) {
        const item = result.find(({ day }) => {
          const m = moment(day);
          return curDay.dayOfYear() === m.dayOfYear() && curDay.year() === m.year();
        }) || { total: 0, sum: 0 };
        yield {
          day: curDay.clone(),
          beverages: item.total,
          sales: item.sum / 100,
        };
        curDay.add(1, 'days');
      }
    }
    const finalDateRange = isRangeGiven
      ? [daterange[0].clone(), daterange[1].clone()]
      : [moment(result[0].day), moment(result[result.length - 1].day)];
    return new BeveragesStats([...g(finalDateRange)]);
  });
};

export { getBeverages, getBeverageOperations, getBeveragesStats };
