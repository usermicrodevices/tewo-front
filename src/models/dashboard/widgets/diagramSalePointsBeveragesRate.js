import { observable, computed, reaction } from 'mobx';

import { getBeveragesSalePointsStats } from 'services/beverage';

class DiagramSalePointsBeveragesRate {
  generic;

  session;

  @observable data;

  @computed get top() {
    if (typeof this.data === 'undefined') {
      return undefined;
    }
    const result = {};
    for (const [salePointId, values] of Object.entries(this.data)) {
      let beverageSum = 0;
      for (const { beverages } of values) {
        beverageSum += beverages;
      }
      result[salePointId] = beverageSum;
    }
    return result;
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const update = () => {
      this.data = undefined;
      getBeveragesSalePointsStats(
        this.generic.dateRange,
        86400,
      ).then((result) => { this.data = result; });
    };
    reaction(() => this.generic.dateRange, update);
    update();
  }
}

export default DiagramSalePointsBeveragesRate;
