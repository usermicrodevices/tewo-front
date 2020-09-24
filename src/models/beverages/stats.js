import { computed } from 'mobx';

class BeveragesStats {
  data;

  constructor(data) {
    this.data = data;
  }

  @computed get beveragesSeria() {
    return this.data.map(({ beverages }) => beverages);
  }

  @computed get salesSeria() {
    return this.data.map(({ sales }) => sales);
  }

  @computed get sales() {
    let sum = 0;
    for (const { sales } of this.data) {
      sum += sales;
    }
    return sum;
  }

  @computed get beverages() {
    let sum = 0;
    for (const { beverages } of this.data) {
      sum += beverages;
    }
    return sum;
  }
}

export default BeveragesStats;
