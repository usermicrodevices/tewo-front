import { computed, observable, reaction } from 'mobx';

import BeveragesStatsPair from 'models/beverages/statsPair';

class ChartSales {
  generic;

  session;

  @observable beveragesStats;

  @observable properties = {
    dateRange: undefined,
  };

  @computed({ keepAlive: true }) get labels() {
    return this.beveragesStats && this.beveragesStats.xSeria ? this.beveragesStats.xSeria.map((v) => +v) : [];
  }

  @computed({ keepAlive: true }) get isLoaded() {
    return Boolean(this.beveragesStats && this.beveragesStats.isSeriesLoaded);
  }

  @computed({ keepAlive: true }) get chartData() {
    return this.beveragesStats ? this.beveragesStats.salesSeriaCur : [];
  }

  @computed({ keepAlive: true }) get currentSales() {
    return this.beveragesStats ? this.beveragesStats.salesCur : 0;
  }

  @computed({ keepAlive: true }) get salesDiff() {
    return this.beveragesStats ? this.beveragesStats.salesDiff : 0;
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    this.updateValue();
    reaction(() => [this.generic.salePointsId, this.generic.dateRange], this.updateValue);
  }

  updateValue = () => {
    if (typeof this.generic.salePointsId === 'undefined') {
      return;
    }
    this.properties.dateRange = this.generic.dateRange;
    this.beveragesStats = new BeveragesStatsPair((dateRange) => this.session.points.getSalesChart(this.generic.salePointsId, dateRange), this.properties);
  };

  update() {
    this.updateValue();
  }
}

export default ChartSales;
