/* eslint class-methods-use-this: off */
import { computed, observable } from 'mobx';

import Filters from 'models/filters';
import Table from 'models/table';
import { getPrimecost } from 'services/comerce';
import { DECLARE_BEVERAGES_FILTERS } from 'models/beverages';
import Details from 'components/comerce/primecost/details';
import { SemanticRanges } from 'utils/date';

const declareColumns = () => ({
  cityName: {
    isVisibleByDefault: true,
    title: 'Город',
    grow: 1,
  },
  earn: {
    isVisibleByDefault: true,
    title: 'Выручка',
    grow: 1,
    sortDirections: 'both',
    suffix: '₽',
  },
  margin: {
    isVisibleByDefault: true,
    title: 'Прибыль',
    grow: 3,
    sortDirections: 'both',
    isDefaultSort: true,
    isAsyncorder: true,
    suffix: '₽',
  },
});

class PrimeCost extends Table {
  @observable chart;

  @computed get summary() {
    const result = {
      earn: 0,
      cost: 0,
      margin: 0,
    };
    for (const { earn, cost, margin } of this.rawData) {
      result.earn += earn;
      result.cost += cost;
      result.margin += margin;
    }
    return result;
  }

  @computed get top() {
    const result = {};
    for (const { data, session } of this.rawData) {
      for (const point of Object.values(data.details)) {
        for (const drink of Object.values(point.details)) {
          if (!(drink.id in result)) {
            result[drink.id] = {
              id: drink.id,
              name: session.drinks.get(drink.id)?.name,
              earn: 0,
              cost: 0,
              margin: 0,
            };
          }
          const datum = result[drink.id];
          datum.earn += drink.earn;
          datum.cost += drink.cost;
          datum.margin += drink.margin;
        }
      }
    }

    return Object.values(result).map(({
      earn,
      cost,
      margin,
      ...other
    }) => ({
      earn: Math.round(earn),
      cost: Math.round(cost),
      margin: Math.round(margin),
      ...other,
    })).sort(({ margin: a }, { margin: b }) => b - a);
  }

  session;

  constructor(session) {
    const filters = new Filters(DECLARE_BEVERAGES_FILTERS(session));

    filters.isShowSearch = false;
    filters.set('device_date', SemanticRanges.prw30Days.resolver());

    const i = { v: false };
    super(declareColumns(session), (limit, offset, search) => {
      if (i.v) {
        this.chart = undefined;
      }
      i.v = true;
      return getPrimecost(session, (chartData) => {
        this.chart = chartData;
      })(limit, offset, search);
    }, filters);

    this.session = session;
  }

  toString() {
    return 'ComercePrimecost';
  }

  get isImpossibleToBeSync() { return true; }

  get isStickyTHead() { return true; }

  actions = {
    isVisible: true,
    detailsWidget: Details,
  };
}

export default PrimeCost;
