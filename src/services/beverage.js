import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const getBeverage = (limit, offset) => new Promise((resolve, reject) => {
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
    resolve(response);
  });
});

export default getBeverage;
