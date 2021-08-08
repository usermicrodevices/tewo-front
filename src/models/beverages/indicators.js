import { observable } from 'mobx';
import { getBeverageIndicators } from 'services/beverage';

class BeverageIndicators extends Map {
  @observable isLoaded = false;

  constructor() {
    super();

    getBeverageIndicators(this).then(() => { this.isLoaded = true; });
  }
}

export default BeverageIndicators;
