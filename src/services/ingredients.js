import { get, patch } from 'utils/request';
import checkData from 'utils/dataCheck';
import Ingredient from 'models/ingredients/ingredient';

const LOCATION = '/refs/ingredients/';

const RENAMER = {
  id: 'id',
  name: 'name',
  dimension: 'dimension',
  company: 'companyId',
  cost: 'cost',
  currency: 'currency',
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
      currency: 'string',
      dimension: 'string',
    },
  )) {
    console.error(`Неожиданный ответ по адресу ${LOCATION}`, json);
  }

  for (const [jsonName, modelName] of Object.entries(RENAMER)) {
    // eslint-disable-next-line
    acceptor[modelName] = json[jsonName];
  }
  return acceptor;
};

const getIngredients = (session) => () => get(LOCATION).then((result) => {
  if (!Array.isArray(result)) {
    console.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
  }
  return {
    count: result.length,
    results: result.map((ingredientData) => {
      const ingredient = new Ingredient(session);
      return transform(ingredientData, ingredient);
    }),
  };
});

const patchIngredient = (id, data) => patch(`${LOCATION}${id}`, form(data)).then((josn) => transform(josn, {}));

export { getIngredients, patchIngredient };
