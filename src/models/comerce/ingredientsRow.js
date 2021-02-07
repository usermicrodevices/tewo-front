import { computed } from 'mobx';

class IngredientsRow {
  ingredientId;

  data;

  session;

  @computed get ingredient() {
    return this.session.ingredients.get(this.ingredientId);
  }

  constructor(ingredientId, data, session) {
    this.ingredientId = ingredientId;
    this.data = data;
    this.session = session;
  }

  @computed get ingredientName() {
    return this.ingredient?.name;
  }

  @computed get measure() {
    return this.ingredient?.dimension;
  }

  @computed get count() {
    return this.data.count;
  }

  @computed get costOfAll() {
    return this.data.costOfAll;
  }

  @computed get cost() {
    return this.ingredient?.cost;
  }

  @computed get detailsRows() {
    return Object.entries(this.data.details).map(([drinkId, detail]) => ({
      key: drinkId,
      name: this.session.drinks.get(parseInt(drinkId, 10))?.name,
      ...detail,
      earn: detail.ingredientsCount * this.cost,
    }));
  }
}

export default IngredientsRow;
