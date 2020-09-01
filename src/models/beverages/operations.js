import { computed } from 'mobx';
import { getBeverageOperations } from 'services/beverage';

class BeverageOprations extends Map {
  constructor() {
    super();

    getBeverageOperations(this);
  }

  @computed get selector() {
    return [...this.entries()];
  }
}

export default BeverageOprations;
