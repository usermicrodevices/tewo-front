import { action, computed, observable } from 'mobx';

class PrimeCostRow {
  session;

  cityId;

  data;

  @observable expanded;

  @action setExpanded(expanded) {
    this.expanded = expanded;
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
    return Object.values(this.data.details).map((point) => ({
      key: point.id,
      name: this.session.points.get(point.id)?.name,
      ...point,
      details: Object.values(point.details).map((drink) => ({
        key: drink.id,
        name: this.session.drinks.get(drink.id)?.name,
        ...drink,
        details: Object.values(drink.details).map((ingredient) => ({
          key: ingredient.id,
          name: this.session.ingredients.get(ingredient.id)?.name,
          ...ingredient,
        })),
      })),
    }));
  }

  @computed get detailsRowsCount() {
    return Object.keys(this.data.details).length;
  }
}

export default PrimeCostRow;
