import { observable } from 'mobx';
import { getPrices } from 'services/price';

class Prices extends Map {
  @observable isLoaded = false;

  constructor(session) {
    super();

    getPrices(session)()
      .then(({ results }) => results.forEach((price) => this.set(price.id, price)))
      .then(() => { this.isLoaded = true; });
  }

  getBySet(pricesIdSet) {
    if (!this.isLoaded) {
      return undefined;
    }
    return [...this.values()].filter(({ id }) => pricesIdSet.has(id));
  }
}

export default Prices;
