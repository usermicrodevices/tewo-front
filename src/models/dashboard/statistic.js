import { observable, computed } from 'mobx';

import { getBeveragesSalePointsStats } from 'services/beverage';
import { SmallSemanticRanges } from 'utils/date';

class Statistic {
  settings;

  session;

  @observable data = null;

  @computed get value() {
    if (this.data === null) {
      return undefined;
    }
    const { chart } = this;
    let result = 0;
    for (const b of chart) {
      result += b;
    }
    return result;
  }

  @computed get chart() {
    if (this.data === null) {
      return undefined;
    }
    const entries = Object.values(this.data);
    const result = entries[0].map(({ beverages }) => beverages);
    for (const values of entries.slice(1)) {
      for (const [id, { beverages }] of values.entries()) {
        result[id] += beverages;
      }
    }
    return result;
  }

  @computed get stats() {
    if (this.data === null) {
      return undefined;
    }
    const result = {};
    for (const [salePointId, values] of this.data) {
      const v = {
        beverages: 0,
        sales: 0,
      };
      for (const { beverages, sales } of values) {
        v.beverages += beverages;
        v.sales += sales;
      }
      result[salePointId] = v;
    }
    return result;
  }

  constructor(settings, session) {
    this.settings = settings;
    this.session = session;

    getBeveragesSalePointsStats(SmallSemanticRanges.prwHalfAnHour.resolver(), 60, session).then((result) => { this.data = result; });
  }
}

export default Statistic;
