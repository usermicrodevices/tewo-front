import { get, patch, post } from 'utils/request';
import checkData from 'utils/dataCheck';
import Drink from 'models/drinks/drink';
import { getRecipes } from './recipes';

const LOCATION = '/refs/drinks/';

const RENAMER = {
  id: 'id',
  plu: 'plu',
  name: 'name',
  company: 'companyId',
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
      plu: 'number',
      name: 'string',
      company: 'number',
      cooking_time: 'number',
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

const getDrinksWithoutRecipe = (session) => () => get(LOCATION).then((result) => {
  if (!Array.isArray(result)) {
    console.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
  }
  return {
    count: result.length,
    results: result.map((json) => transform(json, new Drink(session))),
  };
});

const getDrinks = (session) => () => Promise.all([getDrinksWithoutRecipe(session)(), getRecipes()]).then(([drinks, recipes]) => {
  for (const drink of drinks.results) {
    const { id } = drink;
    if (recipes.has(id)) {
      drink.recipe = recipes.get(id);
      recipes.delete(id);
    }
  }
  if (recipes.size !== 0) {
    console.error('Обнаружены рецепты, не связанные с напитком', recipes);
  }
  return drinks;
});

const applyDrink = (id, changes) => {
  const data = form(changes);
  const request = id === null ? post(LOCATION, data) : patch(`${LOCATION}${id}`, data);
  return request.then((response) => transform(response, {}));
};

export { getDrinks, applyDrink };
