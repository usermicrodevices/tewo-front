import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const getBeverages = (limit, offset = 0, filter = '') => new Promise((resolve, reject) => {
  console.assert(limit >= 0 && offset >= 0, `Неверные параметры запроса наливов "${limit}" "${offset}"`);
  get(`/data/beverages/?limit=${limit}&offset=${offset || 0}${filter !== '' ? `&${filter}` : filter}`).then((response) => {
    const beverageMustBe = {
      cid: 'string',
      created_date: 'date',
      device: 'number',
      device_date: 'date',
      drink: 'number',
      id: 'number',
      operation: 'number',
      sale_sum: 'number',
      canceled: 'boolean',
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
          if (!checkData(beverage, beverageMustBe)) {
            console.error('провален тест для объекта', beverage, beverages);
            return false;
          }
        }
        return true;
      },
    });
    resolve(response);
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

export { getBeverages, getBeverageOperations };
