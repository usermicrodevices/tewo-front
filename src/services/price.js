/* eslint no-param-reassign: off */
import { observable } from 'mobx';
import moment from 'moment';

import {
  get, patch, post, del,
} from 'utils/request';
import apiCheckConsole from 'utils/console';
import checkData from 'utils/dataCheck';
import Price from 'models/price/price';
import PriceGroup from 'models/price/group';

const PRICES_LOCATION = '/refs/prices/';

const RENAMER = {
  drink: 'drinkId',
  price_group: 'groupId',
  code_ext: 'codeExt',
  value: 'value',
  id: 'id',
};

function rename(data, keys, reverse = false) {
  const result = {};

  if (reverse) {
    keys = Object.keys(keys).reduce((acc, key) => {
      acc[keys[key]] = key;
      return acc;
    }, {});
  }

  for (const [jsonName, modelName] of Object.entries(keys)) {
    result[modelName] = data[jsonName];
  }

  return result;
}

const priceObjectFromJSON = (json, acceptor) => {
  if (!checkData(
    json,
    {
      drink: 'number',
      price_group: 'number',
      value: 'number',
      id: 'number',
    },
    {
      nds: 'any',
      code_ext: 'any',
    },
  )) {
    apiCheckConsole.error(`Неожиданный ответ по адресу ${PRICES_LOCATION}`, json);
  }

  const renamedJson = rename(json, RENAMER);

  for (const [key, value] of Object.entries(renamedJson)) {
    acceptor[key] = value;
  }
  return acceptor;
};

const priceFromJSON = (session) => (json) => priceObjectFromJSON(json, new Price(session));

function getPrices(session) {
  return () => get(PRICES_LOCATION).then((result) => {
    if (!Array.isArray(result)) {
      apiCheckConsole.error(`по ${PRICES_LOCATION} ожидается массив, получен ${typeof result}`, result);
    }
    return {
      count: result.length,
      results: result.map(priceFromJSON(session)),
    };
  });
}

const postPrices = (drinks, priceGroupId, session) => Promise.all(drinks.map((drinkId) => post(PRICES_LOCATION, {
  drink: drinkId,
  price_group: priceGroupId,
}))).then((response) => {
  const newPrices = response.map(priceFromJSON(session));
  session.prices.add(newPrices);
  return newPrices;
});

const patchPrice = (id, data) => patch(`${PRICES_LOCATION}${id}`, rename(data, RENAMER, true)).then((result) => priceObjectFromJSON(result, {}));

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
    last_update: 'date',
    decimal_places: 'number',
  })) {
    apiCheckConsole.error(`Неожиданные данные для групп цен ${LOCATION}`, json);
  }
  group.id = json.id;
  group.name = json.name;
  group.companyId = json.company;
  group.conceptionId = json.conception;
  group.systemKey = json.system_key;
  group.devicesIdSet = observable.set(json.device_set);
  group.pricesIdSet = observable.set(json.price_set);
  group.lastUpdate = moment(json.last_update);
  group.decimalPlaces = json.decimal_places;
  return group;
};

function getPriceGroups(session) {
  return () => get(LOCATION).then((result) => {
    if (!Array.isArray(result)) {
      apiCheckConsole.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
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
  conceptionId: 'conception',
  systemKey: 'system_key',
  devicesIdSet: 'device_set',
  pricesIdSet: 'price_set',
  decimalPlaces: 'decimal_places',
};

const applyPriceGroup = (id, changes, session, aditionlDrinks) => {
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
      request.then((response) => transform(response, id === null ? new PriceGroup(session) : {})).then(resolve).catch(reject);
    });
  });
};

const synchronizePriceGroup = (id, devices) => post(`/refs/price_groups/${id}/sync/`, { devices: [...devices.values()] });

export {
  getPrices, getPriceGroups, applyPriceGroup, synchronizePriceGroup, deletePrice, patchPrice,
};
