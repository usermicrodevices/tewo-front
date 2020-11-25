/* eslint class-methods-use-this: off */
import Filters from 'models/filters';
import Table from 'models/table';
import salesLoader from 'services/comerce';
import { SemanticRanges } from 'utils/date';

const declareColumns = (session) => ({
  salePointCityName: {
    isVisibleByDefault: true,
    title: 'Город',
    grow: 1,
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    isAsyncorder: true,
    isDefaultSort: true,
    grow: 1,
  },
  sales: {
    isVisibleByDefault: true,
    title: 'Продажи',
    grow: 2,
    transform: (data) => null,
    sortDirections: 'both',
  },
  beverages: {
    isVisibleByDefault: true,
    title: 'Наливы',
    grow: 2,
    transform: (data) => null,
    sortDirections: 'both',
  },
});

class Sales extends Table {
  constructor(session) {
    const filters = new Filters({
      device_date: {
        type: 'datetimerange',
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
      drink__id: {
        type: 'selector',
        title: 'Напиток',
        apply: (general, data) => general(data.drink),
        selector: () => session.drinks.selector,
        disabled: (filter) => !filter.data.has('device__id'),
      },
      operation__id: {
        type: 'selector',
        title: 'Тип оплаты',
        apply: (general, data) => general(data.sale_sum),
        selector: () => session.beverageOperations.selector,
        disabled: true,
      },
      canceled: {
        type: 'checkbox',
        title: 'Отмемённые',
        apply: (_, data) => data.canceled,
        passiveValue: false,
      },
    });
    filters.set('device_date', SemanticRanges.curMonth.resolver());

    super(declareColumns(session), salesLoader(session, filters), filters);
  }

  get isImpossibleToBeSync() { return true; }

  toString() {
    return 'ComerceSales';
  }
}

export default Sales;
