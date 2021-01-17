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
      if (this.generic.salePointsId === undefined) {
        return;
      }

      this.data = undefined;
      getBeveragesSalePointsStats(
        this.generic.dateRange,
        86400,
        this.generic.salePointsId,
      ).then((result) => { this.data = result; });
    };
    update();

    reaction(() => this.generic.dateRange, update);
    reaction(() => this.generic.salePointsId, update);
  }
}

export default DiagramSalePointsBeveragesRate;
