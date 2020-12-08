import { computed } from 'mobx';

class IngredientsRow {
  ingredientId;

  details;

  session;

  @computed get ingredient() {
    return this.session.ingredients.get(this.ingredientId);
  }

  constructor(ingredientId, details, session) {
    this.ingredientId = ingredientId;
    this.details = details;
    this.session = session;
  }

  @computed get ingredientName() {
    return this.ingredient?.name;
  }

  @computed get measure() {
    return this.ingredient?.dimension;
  }

  @computed get count() {
    let sum = 0;
    if (typeof this.details === 'object' && this.details !== null) {
      for (const { ingredientsCount } of Object.values(this.details)) {
        sum += ingredientsCount;
      }
    }
    return sum;
  }

  @computed get cost() {
    return this.ingredient?.cost;
  }

  @computed get amount() {
    let sum = 0;
    if (typeof this.details === 'object' && this.details !== null) {
      for (const { earn } of Object.values(this.details)) {
        sum += earn;
      }
    }
    return sum / 100;
  }

  @computed get detailsRowsCount() {
    return Object.keys(this.details).length;
  }

  @computed get detailsRows() {
    return Object.entries(this.details).map(([drinkId, detail]) => ({
      key: drinkId,
      name: this.session.drinks.get(parseInt(drinkId, 10))?.name,
      ...detail,
      earn: detail.earn / 100,
    }));
  }
}

export default IngredientsRow;
