import { getPriceGroups } from 'services/price';

class CostGroups extends Map {
  constructor() {
    super();

    getPriceGroups(this);
  }
}

export default CostGroups;
