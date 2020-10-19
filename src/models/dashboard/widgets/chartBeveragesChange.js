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
    this.whole = undefined;
    this.canceled = undefined;
    getBeveragesStats(dateRange, pointsFilter, 86400)
      .then((data) => { console.log('given', data); this.whole = data; });
    getBeveragesStats(dateRange, `canceled=1${pointsFilter ? `&${pointsFilter}` : ''}`, 86400)
      .then((data) => { console.log('canceled', data); this.canceled = data; });
  };

  @computed get isLoaded() {
    return typeof this.whole !== 'undefined' || typeof this.canceled !== 'undefined';
  }

  @computed get series() {
    if (!this.isLoaded) {
      return undefined;
    }
    console.log(this.whole, this.canceled);
    if (typeof this.whole === 'undefined') {
      return [
        {
          data: this.canceled.beveragesSeria.slice().fill(0),
          name: 'Всего наливов',
          axis: 0,
        },
        {
          data: this.canceled.beveragesSeria,
          name: 'Отменённых наливов',
          axis: 0,
        },
      ];
    }
    if (typeof this.canceled === 'undefined') {
      return [
        {
          data: this.whole.beveragesSeria,
          name: 'Всего наливов',
          axis: 0,
        },
        {
          data: this.whole.beveragesSeria.slice().fill(0),
          name: 'Отменённых наливов',
          axis: 0,
        },
      ];
    }
    return [
      {
        data: this.whole.beveragesSeria,
        name: 'Всего наливов',
        axis: 0,
      },
      {
        data: this.canceled.beveragesSeria,
        name: 'Отменённых наливов',
        axis: 0,
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
    return this.whole.xSeria.length > this.canceled.xSeria.length ? this.whole.xSeria : this.canceled.xSeria;
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    reaction(() => [this.generic.salePointsId, this.generic.dateRange], this.update);
    this.update();
  }
}

export default ChartBeveragesChange;
