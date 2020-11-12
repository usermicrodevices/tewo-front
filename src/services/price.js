/* eslint no-param-reassign: off */
import { observable } from 'mobx';

import {
  get, patch, post, del,
} from 'utils/request';
import checkData from 'utils/dataCheck';
import Price from 'models/price/price';
import PriceGroup from 'models/price/group';

const PRICES_LOCATION = '/refs/prices/';

const priceFromJSON = (session) => (json) => {
  if (!checkData(
    json,
    {
      drink: 'number',
      price_group: 'number',
      value: 'number',
      id: 'number',
    },
  )) {
    console.error(`Неожиданный ответ по адресу ${PRICES_LOCATION}`, json);
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
};

function getPrices(session) {
  return () => get(PRICES_LOCATION).then((result) => {
    if (!Array.isArray(result)) {
      console.error(`по ${PRICES_LOCATION} ожидается массив, получен ${typeof result}`, result);
    }
    return {
      count: result.length,
      results: result.map(priceFromJSON(session)),
    };
  });
}

const postPrices = (drinks, priceGroupId, session) => {
  console.log(drinks);
  return Promise.all(drinks.map((drinkId) => post(PRICES_LOCATION, {
    drink: drinkId,
    price_group: priceGroupId,
  }))).then((response) => {
    console.log('r', response);
    const newPrices = response.map(priceFromJSON(session));
    session.prices.add(newPrices);
    return newPrices;
  });
};

const deletePrice = (id) => del(`${PRICES_LOCATION}${id}`);

const LOCATION = '/refs/price_groups/';

const transform = (json, group) => {
  if (!checkData(json, {
    id: 'number',
    name: 'string',
    company: 'number',
    price_set: 'array',
    device_set: 'array',
  }, {
    system_key: 'string',
    conception: 'number',
  })) {
    console.error(`Неожиданные данные для групп цен ${LOCATION}`, json);
  }
  group.id = json.id;
  group.name = json.name;
  group.companyId = json.company;
  group.conception = json.conception;
  group.systemKey = json.system_key;
  group.devicesIdSet = observable.set(json.device_set);
  group.pricesIdSet = observable.set(json.price_set);
  return group;
};

function getPriceGroups(session) {
  return () => get(LOCATION).then((result) => {
    if (!Array.isArray(result)) {
      console.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
    }
    return {
      count: result.length,
      results: result.map((json) => transform(json, new PriceGroup(session))),
    };
  });
}

const FORM = {
  id: 'id',
  name: 'name',
  companyId: 'company',
  conception: 'conception',
  systemKey: 'system_key',
  devicesIdSet: 'device_set',
  pricesIdSet: 'price_set',
};

const applyPriceGroup = (id, changes, aditionlDrinks, session) => {
  const data = {};
  for (const [key, value] of Object.entries(changes)) {
    data[FORM[key]] = key.includes('Set') ? [...value.values()] : value;
  }
  data.price_set = data.price_set || [];
  data.device_set = data.device_set || [];
  const aditionalPrices = Array.isArray(aditionlDrinks) && aditionlDrinks.length > 0 ? postPrices(aditionlDrinks, id, session) : Promise.resolve([]);
  return new Promise((resolve, reject) => {
    aditionalPrices.then((prices) => {
      data.price_set = data.price_set.concat(prices.map(({ id: priceId }) => priceId));
      const request = id === null ? post(LOCATION, data) : patch(`${LOCATION}${id}`, data);
      request.then((response) => transform(response, {})).then(resolve).catch(reject);
    });
  });
};

const synchronizePriceGroup = (id) => post(`/refs/price_groups/${id}/sync/`, {});

export {
  getPrices, getPriceGroups, applyPriceGroup, synchronizePriceGroup, deletePrice,
};
