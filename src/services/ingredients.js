import {
  get, patch, post, del,
} from 'utils/request';
import checkData from 'utils/dataCheck';
import Ingredient from 'models/ingredients/ingredient';
import apiCheckConsole from 'utils/console';
import IngredientsRow from 'models/comerce/ingredientsRow';

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

const getIngredientsConsumption = (session) => (_, __, search) => {
  const location = `/data/beverages/salepoints_ingredients/${search ? `?${search}` : ''}`;
  return get(location).then((response) => {
    const ingredients = {};
    const mustBe = {
      cost: 'number',
      drinks_count: 'number',
      earn: 'number',
      ingredients_count: 'number',
    };
    if (typeof response !== 'object' || response === null) {
      apiCheckConsole.error(`Неожиданный ответ по адресу ${location}`, response);
    }
    for (const point of Object.values(response)) {
      if (typeof point !== 'object' || point === null) {
        apiCheckConsole.error(`Неожиданный ответ по адресу ${location} (ождается объект описания точки продажи)`, point, response);
      }
      for (const [ingredientId, ingredientJSON] of Object.entries(point)) {
        if (!(ingredientId in ingredients)) {
          ingredients[ingredientId] = {};
        }
        if (typeof ingredientJSON !== 'object' || ingredientJSON === null) {
          apiCheckConsole.error(`Неожиданный ответ по адресу ${location} (ождается объект описания ингредиента)`, ingredientJSON, response);
        }
        const ingredient = ingredients[ingredientId];
        for (const [drinkId, drinkJSON] of Object.entries(ingredientJSON)) {
          if (!(drinkId in ingredient)) {
            ingredient[drinkId] = {
              cost: 0,
              drinksCount: 0,
              earn: 0,
              ingredientsCount: 0,
            };
          }
          const drink = ingredient[drinkId];
          checkData(drinkJSON, mustBe);
          drink.cost += drinkJSON.cost;
          drink.drinksCount += drinkJSON.drinks_count;
          drink.earn += drinkJSON.earn;
          drink.ingredientsCount += drinkJSON.ingredients_count;
        }
      }
    }
    const results = Object.entries(ingredients).map(([id, ingredient]) => new IngredientsRow(parseInt(id, 10), ingredient, session));
    return {
      count: results.length,
      results,
    };
  });
};

export {
  getIngredients, applyIngredient, deleteIngredient, getIngredientsConsumption,
};
