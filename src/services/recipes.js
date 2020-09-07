import { post, get, patch } from 'utils/request';
import checkData from 'utils/dataCheck';

const RECIPES_LOCATION = 'refs/recipes';

const getRecipes = () => get(RECIPES_LOCATION).then((data) => {
  if (!Array.isArray(data)) {
    console.error(` ожидается массив, получен ${typeof data}`, data);
    return [];
  }
  const mustBe = {
    id: 'number',
    drink: 'number',
    company: 'number',
    ingredients: 'array',
  };
  return data.map((datum, index) => {
    if (!checkData(datum, mustBe)) {
      console.error(`ошиюка при проверке данных ${RECIPES_LOCATION} #${index}, данные проигнорированы`, datum);
      return null;
    }
    const { drink, id, ingredients } = datum;
    return [
      drink,
      {
        id,
        ingredients: ingredients.map((v) => {
          if (typeof v === 'number') {
            return { id: v, amount: null };
          }
          if (typeof v === 'object') {
            if (!checkData(v, { id: 'number', amount: 'number' })) {
              console.error(`${RECIPES_LOCATION} ошибка при проверке данных ${RECIPES_LOCATION} #${index}/ingredients: неожиданная структура объекта`, v);
            }
          } else {
            console.error(`${RECIPES_LOCATION} ошибка при проверке данных ${RECIPES_LOCATION} #${index}/ingredients: неизвестный тип данных ${typeof v}`, v);
          }
          return v;
        }),
      },
    ];
  });
}).then((d) => {
  const result = new Map(d.filter((v) => v !== null));
  if (result.size !== d.length) {
    console.error(`${RECIPES_LOCATION} обнаружено более одного рецепта для напитка (${result.size} !== ${d.length})`);
  }
  return result;
});

const applyRecipe = (drink, recipe) => {
  if (recipe.id === null) {
    return addRecipe(drink, recipe.ingridients);
  }
  return updateRecipe(recipe);
};

const addRecipe = (drink, ingridients) => post(RECIPES_LOCATION, { drink: drink.id, ingridients }).finally(console.log);

const updateRecipe = ({ id, ingredients }) => patch(`${RECIPES_LOCATION}/${id}/`, { ingredients }).finally(console.log);

export { getRecipes, applyRecipe };
