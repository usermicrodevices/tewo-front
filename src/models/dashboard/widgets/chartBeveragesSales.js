import { observable, reaction } from 'mobx';

import BeveragesStatsPair from 'models/beverages/statsPair';
import { SALES_DATA_TYPES } from 'models/detailsProps';

class Chart {
  generic;

  session;

  @observable beveragesStats;

  @observable properties = {
    visibleCurves: SALES_DATA_TYPES.slice(0, 2).map(({ value }) => value),
    dateRange: undefined,
  };

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const updateValue = () => {
      this.value = undefined;
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

export default Chart;
