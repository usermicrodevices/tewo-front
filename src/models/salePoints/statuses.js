import { computed } from 'mobx';

import { getSalePointsStatuses } from 'services/salePoints';

class SalePointsStatuses extends Map {
  constructor() {
    super();

    getSalePointsStatuses(this);
  }

  @computed get selector() {
    return [...this.entries()].map(([id, { name }]) => [id, name]);
  }
}

export default SalePointsStatuses;
