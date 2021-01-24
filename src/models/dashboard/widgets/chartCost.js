import { observable, reaction } from 'mobx';

import { daterangeToArgs } from 'utils/date';
import { getBeveragesDenseChart } from 'services/beverage';

class ChartBeveragesSales {
  generic;

  session;

  @observable chart;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const updateValue = () => {
      if (typeof this.generic.salePointsId === 'undefined') {
        return;
      }
      this.chart = undefined;
      const dateRangeArg = daterangeToArgs(this.generic.dateRange, 'device_date');
      const pontsArg = this.generic.getPointsFilter('device__sale_point__id');
      const filter = [dateRangeArg.slice(1), pontsArg].filter(Boolean).join('&');
      getBeveragesDenseChart(filter, session).then((response) => { this.chart = response; });
    };
    reaction(() => [this.generic.salePointsId, this.generic.dateRange], updateValue);
    updateValue();
  }
}

export default ChartBeveragesSales;
