/* eslint class-methods-use-this: "off" */
import { computed, observable, action } from 'mobx';

import { applyRecipe } from 'services/recipes';

class RecipeEditor {
  drink;

  name = 'Рецептура';

  editable = {};

  @observable recipe;

  session;

  constructor(drink, session) {
    this.session = session;
    this.drink = drink;
    this.cancel();
  }

  @computed get values() {
    return [];
  }

  @computed get ingredients() {
    const { selector } = this.session.ingredients;
    return this.recipe.ingredients.map(({ id, amount }) => ({
      id,
      amount,
      selector,
      ingredient: id ? this.session.ingredients.get(id) : id,
    }));
  }

  @action setIngredient(itm, val) {
    this.recipe.ingredients[itm].id = val;
  }

  @action setAmount(itm, val) {
    this.recipe.ingredients[itm].amount = val;
  }

  @action add() {
    this.recipe.ingredients.push({ id: null, amount: null });
  }

  @action remove(id) {
    this.recipe.ingredients.splice(id, 1);
  }

  @computed get isEmpty() {
    return this.recipe.ingredients.filter(({ id, amount }) => id !== null || amount !== null).length === 0;
  }

  @action cancel() {
    this.recipe = this.drink.isHaveRecipe ? JSON.parse(JSON.stringify(this.drink.recipe)) : { id: null, ingredients: [{ id: null, amount: null }] };
  }

  update() {
    const ingredients = this.recipe.ingredients.filter(({ id, amount }) => id !== null && amount !== null);
    if (JSON.stringify(this.drink.recipe.ingredients) === JSON.stringify(ingredients)) {
      this.cancel();
      return Promise.resolve();
    }
    return applyRecipe(this.drink, { id: this.recipe.id, ingredients }).then(() => {
      this.drink.recipe = { id: this.recipe.id, ingredients };
    });
  }
}

export default RecipeEditor;
