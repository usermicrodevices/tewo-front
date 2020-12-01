import {
  get, patch, post, del,
} from 'utils/request';
import checkData from 'utils/dataCheck';
import Ingredient from 'models/ingredients/ingredient';
import apiCheckConsole from 'utils/console';

const LOCATION = '/refs/ingredients/';

const RENAMER = {
  id: 'id',
  name: 'name',
  dimension: 'dimension',
  company: 'companyId',
  cost: 'cost',
};

const form = (data) => {
  const json = {};
  const renamer = new Map(Object.entries(RENAMER).map(([dataName, jsonName]) => [jsonName, dataName]));
  for (const [key, value] of Object.entries(data)) {
    json[renamer.get(key)] = value;
  }
  return json;
};

const transform = (json, acceptor) => {
  if (!checkData(
    json,
    {
      id: 'number',
      name: 'string',
      company: 'number',
      cost: 'number',
    },
    {
      dimension: 'string',
    },
  )) {
    apiCheckConsole.error(`Неожиданный ответ по адресу ${LOCATION}`, json);
  }

  for (const [jsonName, modelName] of Object.entries(RENAMER)) {
    // eslint-disable-next-line
    acceptor[modelName] = json[jsonName];
  }
  return acceptor;
};

const getIngredients = (session) => () => get(LOCATION).then((result) => {
  if (!Array.isArray(result)) {
    apiCheckConsole.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
  }
  return {
    count: result.length,
    results: result.map((ingredientData) => {
      const ingredient = new Ingredient(session);
      return transform(ingredientData, ingredient);
    }),
  };
});

const applyIngredient = (id, changes, session) => {
  const data = form(changes);
  const request = id === null ? post(LOCATION, data) : patch(`${LOCATION}${id}`, data);
  return request.then((response) => transform(response, id === null ? new Ingredient(session) : {}));
};

const deleteIngredient = (id) => del(`${LOCATION}${id}`);

export { getIngredients, applyIngredient, deleteIngredient };
