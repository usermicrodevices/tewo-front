/* eslint class-methods-use-this: off */
import Filters from 'models/filters';
import Table from 'models/table';
import { salesDetails, salesLoader } from 'services/comerce';
import { isDateRange, SemanticRanges, stepToPast } from 'utils/date';
import { rangeMetricCompareCell, explainedTitleCell } from 'elements/table/trickyCells';
import Details from 'components/comerce/salesDynamic/details';

const declareColumns = () => ({
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
    sortDirections: 'both',
  },
  deltaSales: {
    isVisibleByDefault: true,
    title: explainedTitleCell('Продажи', '(текущий / предыдущий / %)'),
    grow: 2,
    transform: (_, row) => rangeMetricCompareCell(row.sales),
    sortDirections: 'both',
  },
  deltaBeverages: {
    isVisibleByDefault: true,
    title: explainedTitleCell('Наливы', '(текущий / предыдущий / %)'),
    grow: 2,
    transform: (_, row) => rangeMetricCompareCell(row.beverages),
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

    filters.isShowSearch = false;

    filters.salesDetails = (pointId) => {
      salesDetails(pointId, filters);
    };

    super(declareColumns(session), salesLoader(session, filters), filters);
  }

  get isImpossibleToBeSync() { return true; }

  actions = {
    isVisible: true,
    detailsWidget: Details,
  };

  toString() {
    return 'ComerceSales';
  }
}

export default Sales;
