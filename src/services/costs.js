import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import Cost from 'models/costs/cost';

function getCosts(session) {
  return () => get('refs/prices').then((result) => {
    if (!Array.isArray(result)) {
      console.error(`по /refs/prices/ ожидается массив, получен ${typeof result}`, result);
    }
    return {
      count: result.length,
      results: result.map((deviceData) => {
        if (!checkData(
          deviceData,
          {
          },
        )) {
          console.error('Неожиданный ответ по адресу /refs/prices/', deviceData);
        }
        const device = new Cost(session);
        const renamer = {
        };

        for (const [jsonName, modelName] of Object.entries(renamer)) {
          device[modelName] = deviceData[jsonName];
        }
        return device;
      }),
    };
  });
}

function getCostGroups(map) {
  return get('refs/price_groups').then((result) => {
    for (const datum of result) {
      if (!checkData(datum, { id: 'number', name: 'string' })) {
        console.error('Неожиданные данные для групп цен /refs/price_group', datum);
      }
      map.set(datum.id, datum.name);
    }
  });
}

export { getCosts, getCostGroups };
