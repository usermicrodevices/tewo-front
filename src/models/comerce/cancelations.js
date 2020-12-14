/* eslint class-methods-use-this: off */
import { computed, observable } from 'mobx';
import { getBeverages, getBeveragesStats } from 'services/beverage';

import Filters from 'models/filters';
import Table from 'models/table';
import { DECLARE_BEVERAGES_FILTERS } from 'models/beverages';
import { getSalesTop } from 'services/salePoints';
import { SemanticRanges } from 'utils/date';

const declareColumns = () => ({
  deviceDate: {
    isVisibleByDefault: true,
    isDefaultSort: true,
    sortDirections: 'both',
    isAsyncorder: true,
    title: 'Дата и время',
    grow: 1,
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 1,
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    grow: 1,
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Оборудование',
    grow: 1,
  },
  drinkName: {
    isVisibleByDefault: true,
    title: 'Напиток',
    grow: 1,
  },
});

class Sales extends Table {
  @observable whole;

  @observable canceled;

  @observable top;

  constructor(session) {
    const rawFilters = DECLARE_BEVERAGES_FILTERS(session);
    delete rawFilters.canceled;
    rawFilters.device_date.type = 'daterange';
    const filters = new Filters(rawFilters);

    filters.isShowSearch = false;
    filters.set('device_date', SemanticRanges.prw30Days.resolver());

    super(declareColumns(session), (limit, offset, search) => {
      const cnceledFilters = `canceled=1${search ? `&${search}` : ''}`;
      getBeveragesStats(null, search, 86400)
        .then((data) => { this.whole = data; });
      getBeveragesStats(null, cnceledFilters, 86400)
        .then((data) => { this.canceled = data; });
      getSalesTop(cnceledFilters).then((result) => { this.top = result.sort(({ beverages: a }, { beverages: b }) => b - a); });
      return getBeverages(session)(limit, offset, cnceledFilters);
    }, filters);
  }

  toString() {
    return 'ComerceCancelations';
  }

  get isImpossibleToBeSync() { return true; }

  @computed get wholeBeveragesAmount() {
    return this.whole?.beverages;
  }

  @computed get canceledBeveragesAmount() {
    return this.canceled?.beverages;
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
          width: 2,
          axis: 1,
        },
      ];
    }
    if (typeof this.canceled === 'undefined') {
      return [
        {
          data: this.whole.beveragesSeria,
          name: 'Всего наливов',
          width: 2,
          axis: 0,
        },
      ];
    }
    return [
      {
        data: this.whole.beveragesSeria,
        name: 'Всего наливов',
        width: 2,
        axis: 0,
      },
      {
        data: [...new Array(this.whole.length - this.canceled.length).fill(0), ...this.canceled.beveragesSeria],
        name: 'Отменённых наливов',
        width: 2,
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
}

export default Sales;
