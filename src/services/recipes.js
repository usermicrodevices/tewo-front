import {
  post, get, del, patch,
} from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

const RECIPES_LOCATION = 'refs/recipes';

const MUST_BE = {
  id: 'number',
  drink: 'number',
  amount: 'number',
  ingredient: 'number',
};

function convert(datum) {
  if (typeof datum?.amount === 'string') {
    // eslint-disable-next-line no-param-reassign
    datum.amount = Number(datum.amount);
  }

  if (!checkData(datum, MUST_BE)) {
    apiCheckConsole.error(`ошиюка при проверке данных ${RECIPES_LOCATION}, данные проигнорированы`, datum);
    return null;
  }
  const {
    ingredient, amount, id,
  } = datum;
  return { id: ingredient, amount, recipeNoteId: id };
}

const getRecipes = () => get(RECIPES_LOCATION).then((data) => {
  if (!Array.isArray(data)) {
    apiCheckConsole.error(`${RECIPES_LOCATION} ожидается массив, получен ${typeof data}`, data);
    return [];
  }
  const result = new Map();
  for (const datum of data) {
    const converted = convert(datum);
    if (converted !== null) {
      const { drink } = datum;
      if (!result.has(drink)) {
        result.set(drink, []);
      }
      result.get(drink).push(converted);
    }
  }
  return result;
});

const applyRecipe = (drink, recipe, deletedRecipesIds) => new Promise((resolve, reject) => {
  deletedRecipesIds.forEach((id) => {
    del(`/refs/recipes/${id}/`);
  });

  Promise.all(recipe.map(({ id: ingredient, amount, recipeNoteId }) => {
    if (recipeNoteId) {
      return patch(`/refs/recipes/${recipeNoteId}/`, { ingredient, amount, drink: drink.id });
    }
    return post('/refs/recipes/', { ingredient, amount, drink: drink.id });
  })).then((response) => {
    if (!Array.isArray(response)) {
      apiCheckConsole.error('Неожиданный ответ на обновление ингредиентов', response);
    }
    resolve(response.map((datum) => convert(datum)).filter((v) => v !== null));
  }).catch(reject);
});

export { getRecipes, applyRecipe };
