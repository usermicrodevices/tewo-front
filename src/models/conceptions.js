import { computed } from 'mobx';

import getConceptions from 'services/conceptions';

class Conceptions extends Map {
  constructor() {
    super();

    getConceptions(this);
  }

  @computed get selector() {
    return [...this.entries()].map(([id, { name }]) => [id, name]).filter(([, name]) => name !== '');
  }
}

export default Conceptions;
