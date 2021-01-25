/* eslint class-methods-use-this: off */
import { observable } from 'mobx';

import Format from 'elements/format';
import Filters from 'models/filters';
import Table from 'models/table';
import { getClearances } from 'services/events';
import { getSalesTop } from 'services/salePoints';
import { SemanticRanges } from 'utils/date';
import SalesStuctRow from './salesStructRow';

const declareColumns = () => ({
  drinkName: {
    isVisibleByDefault: true,
    title: 'Напиток',
    grow: 1,
  },
  beverages: {
    isVisibleByDefault: true,
    title: 'Количество',
    grow: 1,
    sortDirections: 'both',
    isDefaultSort: true,
    isAsyncorder: true,
  },
  sales: {
    isVisibleByDefault: true,
    title: 'Сумма продаж',
    grow: 1,
    sortDirections: 'both',
    suffix: '₽',
  },
  partOfAll: {
    isVisibleByDefault: true,
    title: 'Доля наливов',
    grow: 1,
    sortDirections: 'both',
    transform: (_, { percent }) => Format({ children: percent }),
  },
});

class Sales extends Table {
  @observable clearancesAmount;

  constructor(session) {
    const filters = new Filters({
      device_date: {
        type: 'daterange',
        title: 'Момент налива',
        apply: (general, data) => general(data.deviceDate),
      },
      device__sale_point__company__id: {
        type: 'selector',
        title: 'Компания',
        apply: (general, data) => general(data.companyId),
        selector: () => session.companies.selector,
      },
      device__sale_point__id: {
        type: 'selector',
        title: 'Объект',
        apply: (general, data) => general(data.salePointId),
        selector: () => session.points.selector,
      },
      device__id: {
        type: 'selector',
        title: 'Оборудование',
        apply: (general, data) => general(data.deviceId),
        selector: (filter) => session.devices.salePointsSelector(filter.data.get('sale_point__id')),
      },
    });
    filters.set('device_date', SemanticRanges.curMonth.resolver());

    filters.isShowSearch = false;

    super(declareColumns(session), (_, __, search) => {
      getClearances(session)(1, 0, search.split('device_date').join('open_date')).then(({ count }) => { this.clearancesAmount = count; });
      return getSalesTop(search).then((result) => {
        let sum = 0;
        for (const { beverages } of result) {
          sum += beverages;
        }
        return {
          count: result.length,
          results: result.map(({ drinkId, beverages, sales }) => new SalesStuctRow(beverages, sales, sum ? beverages / sum : 0, drinkId, session)),
        };
      });
    }, filters);
  }

  get isImpossibleToBeSync() { return true; }

  toString() {
    return 'ComerceStruct';
  }
}

export default Sales;
