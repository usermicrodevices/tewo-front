import { computed, observable } from 'mobx';

class Details {
  session;

  @observable data;

  @computed get isLoaded() {
    return typeof this.data !== 'undefined';
  }

  constructor(salesRow) {
    this.session = salesRow.session;

    salesRow.filter.salesDetails(salesRow.salePointId).then((result) => {
      this.data = result;
    });
  }

  @computed get rows() {
    if (!this.isLoaded) {
      return undefined;
    }
    const [cur, prw] = this.data;
    const drinksResolver = new Map(this.session.drinks.getSubset(
      new Set(cur.map(({ drinkId }) => drinkId)),
    ).map(({ id, name }) => [id, name]));
    const prwMap = new Map(prw.map(({ drinkId, ...value }) => [drinkId, value]));
    return cur.map(({ drinkId, beverages: curBeverages, sales: curSales }) => {
      const pewValue = prwMap.get(drinkId);
      const beverages = {
        cur: curBeverages,
        prw: pewValue ? pewValue.beverages : null,
      };
      const sales = {
        cur: curSales,
        prw: pewValue ? pewValue.sales : null,
      };
      return {
        key: drinkId,
        name: drinksResolver && drinksResolver.get(drinkId),
        beverages,
        sales,
        deltaSales: sales.cur / sales.prw,
        deltaBeverages: beverages.cur / beverages.prw,
      };
    });
  }
}

export default Details;
