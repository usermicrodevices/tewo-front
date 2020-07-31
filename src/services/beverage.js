import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const getBeverage = (limit, offset = 0) => new Promise((resolve, reject) => {
  console.assert(limit >= 0 && offset >= 0, `Неверные параметры запроса наливов "${limit}" "${offset}"`);
  get(`/data/beverages/?limit=${limit}&offset=${offset || 0}`).then((response) => {
    const beverageMustBe = {
      cid: 'string',
      created_date: 'date',
      device: 'number',
      device_date: 'date',
      drink: 'number',
      id: 'number',
      operation: 'number',
      sale_sum: 'number',
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
            return false;
          }
        }
        return true;
      },
    });
    //console.log('loaded', response.count, `\n${response.results.map(({ cid, id }) => [id, cid].join(' ')).join('\n')}`);
    //console.trace();
    resolve(response);
  });
});

export default getBeverage;
