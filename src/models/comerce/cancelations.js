/* eslint class-methods-use-this: off */
import { computed, observable } from 'mobx';
import { getBeverages, getBeveragesStats } from 'services/beverage';

import Filters from 'models/filters';
import Table from 'models/table';
import { DECLARE_BEVERAGES_FILTERS } from 'models/beverages';
import { getSalesTop } from 'services/salePoints';
import { SemanticRanges } from 'utils/date';
import { devices as devicesRout, salePoints as salePointsRout } from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';
import { sequentialGet } from 'utils/request';

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
    transform: (_, datum, width) => tableItemLink(datum.salePointName, `${salePointsRout.path}/${datum.salePointId}`, width),
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Оборудование',
    grow: 1,
    transform: (_, datum, width) => tableItemLink(datum.deviceName, `${devicesRout.path}/${datum.deviceId}`, width),
  },
  drinkName: {
    isVisibleByDefault: true,
    title: 'Напиток',
    grow: 1,
  },
});

const sequentialGetter = (session, allAcceptor, cancelAcceptor, salesAcceptor) => {
  const sequentialStatsAll = sequentialGet();
  const sequentialStatsCancel = sequentialGet();
  const sequentialTop = sequentialGet();

  return (limit, offset, search) => {
    const cnceledFilters = `canceled=1${search ? `&${search}` : ''}`;
    getBeveragesStats(null, search, 86400, sequentialStatsAll)
      .then(allAcceptor);
    getBeveragesStats(null, cnceledFilters, 86400, sequentialStatsCancel)
      .then(cancelAcceptor);
    getSalesTop(cnceledFilters, sequentialTop).then(salesAcceptor);
    return getBeverages(session)(limit, offset, cnceledFilters);
  };
};

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

    super(declareColumns(session), sequentialGetter(
      session,
      (data) => { this.whole = data; },
      (data) => { this.canceled = data; },
      (result) => { this.top = result.sort(({ beverages: a }, { beverages: b }) => b - a); },
    ), filters);
  }

  toString() {
    return 'ComerceCancelations';
  }

  get isImpossibleToBeSync() { return true; }

  @computed get wholeBeveragesAmount() {
    return this.whole?.beverages;
  }

  @computed get canceledBeveragesAmount() {
    return this.isLoaded ? this.data.length : undefined;
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
        data: [...new Array(Math.max(0, (this.whole.length - this.canceled.length) || 0)).fill(0), ...this.canceled.beveragesSeria],
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
    return this.whole.length >= this.canceled.length ? this.whole.xSeria : this.canceled.xSeria;
  }
}

export default Sales;
