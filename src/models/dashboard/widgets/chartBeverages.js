import { computed, observable, reaction } from 'mobx';

import BeveragesStatsPair from 'models/beverages/statsPair';

class ChartBeverages {
  generic;

  session;

  @observable beveragesStats;

  @observable properties = {
    dateRange: undefined,
  };

  @computed({ keepAlive: true }) get labels() {
    return this.beveragesStats?.xSeria ? this.beveragesStats.xSeria.map((v) => +v) : [];
  }

  @computed({ keepAlive: true }) get isLoaded() {
    return Boolean(this.beveragesStats && this.beveragesStats?.isSeriesLoaded);
  }

  @computed({ keepAlive: true }) get chartData() {
    return this.beveragesStats?.beveragesSeriaCur;
  }

  @computed({ keepAlive: true }) get currentBeverages() {
    return this.beveragesStats?.beveragesCur;
  }

  @computed({ keepAlive: true }) get beveragesDiff() {
    return this.beveragesStats?.beveragesDiff;
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const updateValue = () => {
      if (typeof this.generic.salePointsId === 'undefined') {
        return;
      }
      this.properties.dateRange = this.generic.dateRange;
      this.beveragesStats = new BeveragesStatsPair((dateRange) => session.points.getSalesChart(this.generic.salePointsId, dateRange), this.properties);
    };
    reaction(() => [this.generic.salePointsId, this.generic.dateRange], updateValue);
    updateValue();
  }
}

export default ChartBeverages;
