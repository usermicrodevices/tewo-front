import { computed } from 'mobx';

import getCurrencies from 'services/currencies';

class Currencies extends Map {
  constructor() {
    super();

    getCurrencies(this);
  }

  @computed get selector() {
    return [...this.entries()].map(([id, { name }]) => [id, name]);
  }
}

export default Currencies;
