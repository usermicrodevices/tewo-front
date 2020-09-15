/* eslint class-methods-use-this: off */
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
    return this.recipe.map(({ id, amount }) => ({
      id,
      amount,
      ingredient: id ? this.session.ingredients.get(id) : id,
    }));
  }

  @computed get ingredientsSelector() {
    const usedIngredients = new Set((this.recipe).map(({ id }) => id));
    return this.session.ingredients.selector.filter(([id]) => !usedIngredients.has(id));
  }

  @action setIngredient(itm, val) {
    this.recipe[itm].id = val;
  }

  @action setAmount(itm, val) {
    this.recipe[itm].amount = val;
  }

  @action add() {
    this.recipe.push({ id: null, amount: null, recipeNoteId: null });
  }

  @action remove(id) {
    this.recipe.splice(id, 1);
    if (this.recipe.length === 0) {
      this.recipe = [{ id: null, amount: null, recipeNoteId: null }];
    }
  }

  @computed get isEmpty() {
    return this.recipe.filter(({ id, amount }) => id !== null || amount !== null).length === 0;
  }

  @action cancel() {
    this.recipe = this.drink.isHaveRecipe ? JSON.parse(JSON.stringify(this.drink.recipe)) : [{ id: null, amount: null, recipeNoteId: null }];
  }

  update() {
    const recipe = this.recipe.filter(({ id, amount }) => id !== null && amount !== null);
    if (JSON.stringify(this.drink.recipe) === JSON.stringify(recipe)) {
      this.cancel();
      return Promise.resolve();
    }
    return applyRecipe(this.drink, recipe).then((response) => {
      this.drink.recipe = response;
    });
  }
}

export default RecipeEditor;
