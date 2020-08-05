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
        if (beverages.length > 1) {
          for (let i = 1; i < beverages.length; i += 1) {
            const [a, b] = beverages.slice(i - 1, i + 1).map(({ id }) => id);
            if (a <= b) {
              console.error(`провален тест сортировки ${i} a < b: ${a} < ${b}`);
              return false;
            }
          }
        }
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
  });
});

export default getBeverage;
