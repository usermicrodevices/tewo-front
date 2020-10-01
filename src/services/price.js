import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import Price from 'models/price/price';
import PriceGroup from 'models/price/group';

function getPrices(session) {
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

function getPriceGroups(session) {
  return () => get('refs/price_groups').then((result) => {
    if (!Array.isArray(result)) {
      console.error(`по /refs/price_groups/ ожидается массив, получен ${typeof result}`, result);
    }
    for (const datum of result) {
      if (!checkData(datum, {
        id: 'number',
        name: 'string',
        company: 'number',
        conception: 'number',
        system_key: 'string',
        // @todo попросил добавить эти поля в эндпоинт не до конца разобравшить
        // в апи до конца. Они не используются. Можно бы было попросить убрать,
        // но с другой стороны связки приходит null для device.price_group_id))
        price_set: 'array',
        device_set: 'array',
      })) {
        console.error('Неожиданные данные для групп цен /refs/price_group', datum);
      }
    }
    return {
      count: result.length,
      results: result.map((json) => {
        const group = new PriceGroup(session);
        group.id = json.id;
        group.name = json.name;
        group.companyId = json.company;
        group.conception = json.conception;
        group.systemKey = json.system_key;
        group.devicesIdSet = new Set(json.device_set);
        group.pricesIdSet = new Set(json.price_set);
        return group;
      }),
    };
  });
}

export { getPrices, getPriceGroups };
