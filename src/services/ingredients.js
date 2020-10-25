import moment from 'moment';

import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import Ingredient from 'models/ingredients/ingredient';

const getEvents = (session) => () => get('/refs/ingredients/').then((result) => {
  if (!Array.isArray(result)) {
    console.error(`по /refs/ingredients/ ожидается массив, получен ${typeof result}`, result);
  }
  return {
    count: result.length,
    results: result.map((deviceData) => {
      if (!checkData(
        deviceData,
        {
          id: 'number',
          name: 'string',
          company: 'number',
          cost: 'number',
        },
        {
          currency: 'number',
          dimension: 'string',
        },
      )) {
        console.error('Неожиданный ответ по адресу /refs/ingredients/', deviceData);
      }
      const device = new Ingredient(session);
      const renamer = {
        id: 'id',
        name: 'name',
        dimension: 'dimension',
        company: 'companyId',
      };

      for (const [jsonName, modelName] of Object.entries(renamer)) {
        if (modelName.indexOf('Date') >= 0) {
          device[modelName] = moment(deviceData[jsonName]);
        } else {
          device[modelName] = deviceData[jsonName];
        }
      }
      return device;
    }),
  };
});

export default getEvents;
