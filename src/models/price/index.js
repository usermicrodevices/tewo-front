import { getPrices } from 'services/price';

class Prices extends Map {
  constructor(session) {
    super();

    getPrices(session)().then(({ results }) => results.forEach((price) => this.set(price.id, price)));
  }
}

export default Prices;
