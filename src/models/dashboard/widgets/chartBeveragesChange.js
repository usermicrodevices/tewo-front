import { computed, observable, reaction } from 'mobx';
import { getBeveragesStats } from 'services/beverage';

class ChartBeveragesChange {
  session;

  generic;

  @observable whole;

  @observable canceled;

  update = () => {
    const { salePointsId, dateRange } = this.generic;
    if (typeof salePointsId === 'undefined') {
      return;
    }
    const pointsFilter = this.generic.getPointsFilter('device__sale_point__id');
    getBeveragesStats(dateRange, pointsFilter, 86400)
      .then((data) => { this.whole = data; });
    getBeveragesStats(dateRange, `canceled=1${pointsFilter ? `&${pointsFilter}` : ''}`, 86400)
      .then((data) => { this.canceled = data; });
  };

  @computed get isLoaded() {
    return typeof this.whole !== 'undefined' || typeof this.canceled !== 'undefined';
  }

  @computed get series() {
    if (!this.isLoaded) {
      return undefined;
    }
    if (typeof this.whole === 'undefined') {
      return [
        {
          data: this.canceled.beveragesSeria,
          name: 'Отменённых наливов',
          width: 4,
          axis: 1,
        },
      ];
    }
    if (typeof this.canceled === 'undefined') {
      return [
        {
          data: this.whole.beveragesSeria,
          name: 'Всего наливов',
          width: 4,
          axis: 0,
        },
      ];
    }
    return [
      {
        data: this.whole.beveragesSeria,
        name: 'Всего наливов',
        width: 4,
        axis: 0,
      },
      {
        data: [...new Array(this.whole.length - this.canceled.length).fill(0), ...this.canceled.beveragesSeria],
        name: 'Отменённых наливов',
        width: 4,
        axis: 1,
      },
    ];
  }

  @computed get xSeria() {
    if (!this.isLoaded) {
      return undefined;
    }
    if (typeof this.whole === 'undefined') {
      return this.canceled.xSeria;
    }
    if (typeof this.canceled === 'undefined') {
      return this.whole.xSeria;
    }
    return this.whole.length > this.canceled.length ? this.whole.xSeria : this.canceled.xSeria;
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    reaction(() => [this.generic.salePointsId, this.generic.dateRange], () => {
      this.whole = undefined;
      this.canceled = undefined;
      this.update();
    });
    this.update();
  }
}

export default ChartBeveragesChange;
