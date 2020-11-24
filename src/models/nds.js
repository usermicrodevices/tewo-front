import { computed } from 'mobx';

import getNDS from 'services/nds';

class NDS extends Map {
  constructor() {
    super();

    getNDS(this);
  }

  @computed get selector() {
    return [...this.entries()];
  }
}

export default NDS;
