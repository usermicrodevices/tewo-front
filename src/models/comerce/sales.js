/* eslint class-methods-use-this: off */
import { computed, observable } from 'mobx';

import Filters from 'models/filters';
import Table from 'models/table';
import { salesDetails, salesLoader } from 'services/comerce';
import { SemanticRanges } from 'utils/date';
import { rangeMetricCompareCell, explainedTitleCell } from 'elements/table/trickyCells';
import Details from 'components/comerce/salesDynamic/details';
import { SALES_DATA_TYPES } from 'models/detailsProps';

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
  curSales: {
    isVisibleByDefault: true,
    title: explainedTitleCell('Продажи', '(текущий / предыдущий / %)'),
    grow: 2,
    transform: (_, row) => rangeMetricCompareCell(row.sales, '₽'),
    sortDirections: 'both',
  },
  curBeverages: {
    isVisibleByDefault: true,
    title: explainedTitleCell('Наливы', '(текущий / предыдущий / %)'),
    grow: 2,
    transform: (_, row) => rangeMetricCompareCell(row.beverages),
    sortDirections: 'both',
  },
});

class Sales extends Table {
  @observable chart;

  @observable properties = {
    visibleCurves: SALES_DATA_TYPES.slice(0, 2).map(({ value }) => value),
  };

  @computed get beveragesSeriaPrw() {
    return this.chart.prw.beveragesSeria;
  }

  @computed get wholeSales() {
    if (!this.isLoaded) {
      return {
        cur: undefined,
        prw: undefined,
      };
    }
    return {
      cur: this.chart?.cur.sales / 100,
      prw: this.chart?.prw.sales / 100,
    };
  }

  @computed get salesSeriaPrw() {
    return this.chart.prw.salesSeria;
  }

  @computed get beveragesSeriaCur() {
    return this.chart.cur.beveragesSeria;
  }

  @computed get salesSeriaCur() {
    return this.chart.cur.salesSeria;
  }

  @computed get series() {
    if (!this.isLoaded) {
      return undefined;
    }
    const visibleCurves = new Set(this.properties.visibleCurves);
    const series = SALES_DATA_TYPES.filter(({ value }) => visibleCurves.has(value) && typeof this[value] !== 'undefined');
    return series.map(({ label, value, axis }) => ({ data: this[value], name: label, axis }));
  }

  @computed get xSeria() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.chart.cur.xSeria;
  }

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
    });
    filters.set('device_date', SemanticRanges.prw30Days.resolver());

    filters.isShowSearch = false;

    filters.salesDetails = (pointId) => salesDetails(pointId, filters);

    super(declareColumns(session), salesLoader(session, filters, (cur, prw) => {
      this.chart = { prw, cur };
    }), filters);
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
