import { computed, observable } from 'mobx';
import { getBeverageOperations } from 'services/beverage';

class BeverageOprations extends Map {
  @observable isLoaded = false;

  constructor() {
    super();

    getBeverageOperations(this).then(() => { this.isLoaded = true; });
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return [...this.entries()];
  }
}

export default BeverageOprations;
