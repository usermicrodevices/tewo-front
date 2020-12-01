import { computed } from 'mobx';

class Row {
  beverages;

  sales;

  partOfAll;

  drinkId;

  session;

  constructor(beverages, sales, partOfAll, drinkId, session) {
    this.beverages = beverages;
    this.sales = sales;
    this.partOfAll = partOfAll;
    this.drinkId = drinkId;
    this.session = session;
  }

  @computed get drinkName() {
    return this.session.drinks.get(this.drinkId)?.name;
  }

  @computed get percent() {
    return `${Math.round(this.partOfAll * 100000) / 1000}%`;
  }
}

export default Row;
