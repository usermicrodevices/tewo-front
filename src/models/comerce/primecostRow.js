import { action, computed, observable } from 'mobx';

class PrimeCostRow {
  session;

  cityId;

  data;

  expanded = observable.map();

  @action setExpanded(expanded, parent) {
    this.expanded.set(parent, expanded);
  }

  constructor(cityId, data, session) {
    this.session = session;
    this.cityId = cityId;
    this.data = data;
  }

  get id() {
    return this.cityId;
  }

  @computed get city() {
    return this.session.locations.getCity(this.cityId);
  }

  @computed get cityName() {
    const { city } = this;
    return city && city.name;
  }

  @computed get earn() {
    return this.data.earn;
  }

  @computed get cost() {
    return this.data.cost;
  }

  @computed get margin() {
    return this.data.margin;
  }

  @computed get rows() {
    return Object.values(this.data.details).map((pointData) => ({
      key: pointData.id,
      name: this.session.points.get(pointData.id)?.name,
      ...pointData,
      details: Object.values(pointData.details).map((drinkData) => {
        const drink = this.session.drinks.get(drinkData.id);
        return {
          key: drinkData.id,
          name: drink?.name,
          ...drinkData,
          details: Object.values(drinkData.details).map((ingredientData) => {
            const key = ingredientData.id;
            const ingredient = this.session.ingredients.get(key);
            const ingredientAmount = drink && drink.recipe.find(({ id }) => id === key)?.amount;
            const drinkCost = ingredientAmount * ingredient?.cost;
            return {
              key,
              name: ingredient?.name,
              ingredientAmount,
              ingredientCost: ingredient?.cost,
              drinkCost: isFinite(drinkCost) ? drinkCost : undefined,
              measure: ingredient.dimension,
              ...ingredientData,
            };
          }),
        };
      }),
    }));
  }
}

export default PrimeCostRow;
