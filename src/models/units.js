import { computed } from 'mobx';

import getUnits from 'services/units';

class Units extends Map {
  constructor() {
    super();

    getUnits(this);
  }

  @computed get selector() {
    return [...this.entries()].map(([id, { name }]) => [id, name]);
  }
}

export default Units;
