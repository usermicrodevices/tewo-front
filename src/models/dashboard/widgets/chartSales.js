import { computed, observable, reaction } from 'mobx';

import BeveragesStatsPair from 'models/beverages/statsPair';
import { SALES_DATA_TYPES } from 'models/detailsProps';

class ChartSales {
  generic;

  session;

  @observable beveragesStats;

  @observable properties = {
    visibleCurves: SALES_DATA_TYPES.slice(0, 2).map(({ value }) => value),
    dateRange: undefined,
  };

  @computed({ keepAlive: true }) get labels() {
    return this.beveragesStats.xSeria ? this.beveragesStats.xSeria.map(v => +v) : [];
  }

  @computed({ keepAlive: true }) get isLoaded() {
    return this.beveragesStats.isSeriesLoaded;
  }

  @computed({ keepAlive: true }) get chartData() {
    return this.beveragesStats.salesSeriaCur;
  }

  @computed({ keepAlive: true }) get currentSales() {
    return this.beveragesStats.salesCur;
  }

  @computed({ keepAlive: true }) get salesDiff() {
    return this.beveragesStats.salesDiff;
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

export default ChartSales;
