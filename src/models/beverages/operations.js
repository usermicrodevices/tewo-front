import { getBeverageOperations } from 'services/beverage';

class BeverageOprations extends Map {
  constructor() {
    super();

    getBeverageOperations(this);
  }
}

export default BeverageOprations;
