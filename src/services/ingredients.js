import {
  get, patch, post, del,
} from 'utils/request';
import checkData from 'utils/dataCheck';
import Ingredient from 'models/ingredients/ingredient';
import apiCheckConsole from 'utils/console';
import IngredientsRow from 'models/comerce/ingredientsRow';

import { getBeveragesDense } from './beverage';

const LOCATION = '/refs/ingredients/';

const RENAMER = {
  id: 'id',
  name: 'name',
  company: 'companyId',
  cost: 'cost',
  unit: 'unitId',
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
      unit: 'string',
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

const getIngredientsConsumption = (session) => (_, __, search) => getBeveragesDense(search).then((response) => {
  const ingredients = {};
  for (const point of response.values()) {
    for (const [drinkId, drinkData] of point.entries()) {
      for (const [ingredientId, ingredientData] of drinkData.ingredients.entries()) {
        if (!(ingredientId in ingredients)) {
          ingredients[ingredientId] = {
            details: {},
            count: 0,
            costOfAll: 0,
          };
        }
        const ingredient = ingredients[ingredientId];
        ingredient.count += ingredientData.count;
        ingredient.costOfAll += ingredientData.cost;

        if (!(drinkId in ingredient.details)) {
          ingredient.details[drinkId] = {
            drinksCount: 0,
            earn: 0,
            ingredientsCount: 0,
          };
        }
        const drink = ingredient.details[drinkId];
        drink.ingredientsCount += ingredientData.count;
        drink.drinksCount += drinkData.count;
        drink.earn += drinkData.sum;
      }
    }
  }
  for (const point of response.values()) {
    for (const ingredient of Object.values(ingredients)) {
      for (const [drinkId, drinkData] of Object.entries(ingredient.details)) {
        const drink = point.get(drinkId);
        if (typeof drink === 'object') {
          drinkData.earn += drink.sum;
          drinkData.drinksCount += drink.count;
        }
      }
    }
  }

  const results = Object.entries(ingredients).map(([id, ingredient]) => new IngredientsRow(parseInt(id, 10), ingredient, session));
  return {
    count: results.length,
    results,
  };
});

export {
  getIngredients, applyIngredient, deleteIngredient, getIngredientsConsumption,
};
