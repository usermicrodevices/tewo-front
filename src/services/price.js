import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import Price from 'models/price/price';

function getPriceList(session) {
  return () => get('refs/prices').then((result) => {
    if (!Array.isArray(result)) {
      console.error(`по /refs/prices/ ожидается массив, получен ${typeof result}`, result);
    }
    return {
      count: result.length,
      results: result.map((json) => {
        if (!checkData(
          json,
          {
            drink: 'number',
            price_group: 'number',
            value: 'number',
            id: 'number',
          },
        )) {
          console.error('Неожиданный ответ по адресу /refs/prices/', json);
        }
        const price = new Price(session);
        const renamer = {
          drink: 'drinkId',
          price_group: 'groupId',
          value: 'value',
          id: 'id',
        };

        for (const [jsonName, modelName] of Object.entries(renamer)) {
          price[modelName] = json[jsonName];
        }
        return price;
      }),
    };
  });
}

function getPriceGroups(map) {
  return get('refs/price_groups').then((result) => {
    for (const datum of result) {
      if (!checkData(datum, {
        id: 'number',
        name: 'string',
        company: 'number',
        conception: 'number',
        system_key: 'string',
      })) {
        console.error('Неожиданные данные для групп цен /refs/price_group', datum);
      }
      map.set(datum.id, {
        name: datum.name,
        companyId: datum.company,
        conception: datum.conception,
        systemKey: 'string',
      });
    }
  });
}

export { getPriceList, getPriceGroups };
