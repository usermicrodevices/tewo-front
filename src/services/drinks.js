import moment from 'moment';

import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import Drink from 'models/drinks/drink';
import { getRecipes } from './recipes';

const getDrinksWithoutRecipe = (session) => () => get('/refs/drinks/').then((result) => {
  if (!Array.isArray(result)) {
    console.error(`по /refs/drinks/ ожидается массив, получен ${typeof result}`, result);
  }
  return {
    count: result.length,
    results: result.map((deviceData) => {
      if (!checkData(
        deviceData,
        {
          id: 'number',
          plu: 'number',
          name: 'string',
          company: 'number',
          cooking_time: 'number',
        },
      )) {
        console.error('Неожиданный ответ по адресу /refs/drinks/', deviceData);
      }
      const device = new Drink(session);
      const renamer = {
        id: 'id',
        plu: 'plu',
        name: 'name',
        company: 'companyId',
      };

      for (const [jsonName, modelName] of Object.entries(renamer)) {
        if (modelName.indexOf('Date') >= 0) {
          device[modelName] = moment(deviceData[jsonName]);
        } else {
          device[modelName] = deviceData[jsonName];
        }
      }
      return device;
    }),
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

export default getDrinks;
