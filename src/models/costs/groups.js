import { getCostGroups } from 'services/costs';

class CostGroups extends Map {
  constructor() {
    super();

    getCostGroups(this);
  }
}

export default CostGroups;
