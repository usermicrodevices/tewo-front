import { post, get, del } from 'utils/request';
import checkData from 'utils/dataCheck';

const RECIPES_LOCATION = 'refs/recipes';

const MUST_BE = {
  id: 'number',
  drink: 'number',
  amount: 'number',
  ingredient: 'number',
};

function convert(datum) {
  if (!checkData(datum, MUST_BE)) {
    console.error(`ошиюка при проверке данных ${RECIPES_LOCATION}, данные проигнорированы`, datum);
    return null;
  }
  const {
    ingredient, amount, id,
  } = datum;
  return { id: ingredient, amount, recipeNoteId: id };
}

const getRecipes = () => get(RECIPES_LOCATION).then((data) => {
  if (!Array.isArray(data)) {
    console.error(` ожидается массив, получен ${typeof data}`, data);
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

const applyRecipe = (drink, recipe) => new Promise((resolve, reject) => {
  Promise.all(recipe.filter(({ recipeNoteId }) => recipeNoteId !== null).map(({ recipeNoteId }) => del(`/refs/recipes/${recipeNoteId}/`))).then(() => {
    Promise.all(recipe.map(({ id: ingredient, amount }) => post('/refs/recipes/', { ingredient, amount, drink: drink.id }))).then((response) => {
      if (!Array.isArray(response)) {
        console.error('Неожиданный ответ на обновление ингридиентов', response);
      }
      resolve(response.map((datum) => convert(datum)).filter((v) => v !== null));
    }).catch(reject);
  }).catch(reject);
});

export { getRecipes, applyRecipe };
