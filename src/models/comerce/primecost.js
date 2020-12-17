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
    title: 'Маржа',
    grow: 3,
    sortDirections: 'both',
    isDefaultSort: true,
    isAsyncorder: true,
    suffix: '₽',
  },
});

class PrimeCost extends Table {
  @observable chartData;

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

  @computed get chart() {
    if (typeof this.chartData === 'undefined') {
      return undefined;
    }
    const DRINKS_AMOUNT = 6;
    const { session } = this;
    const result = {};
    for (const drinks of this.chartData.values()) {
      for (const [drinkId, drink] of drinks.entries()) {
        if (!(drinkId in result)) {
          result[drinkId] = {
            name: session.drinks.get(drinkId)?.name,
            margin: 0,
            data: {},
          };
        }
        const datum = result[drinkId];
        datum.margin += drink.sum;
        for (const [ingredientId, { cost }] of drink.ingredients.entries()) {
          datum.data[ingredientId] = (datum.data[ingredientId] || 0) + cost;
          datum.margin -= cost;
        }
      }
    }
    const orderedResult = Object.entries(result).sort(([, { margin: a }], [, { margin: b }]) => b - a).slice(0, DRINKS_AMOUNT);
    const categories = orderedResult.slice(0, DRINKS_AMOUNT).map(([drinkId]) => session.drinks.get(parseInt(drinkId, 10))?.name);
    const usedIngredientsSet = new Set();
    for (const [, { data }] of orderedResult) {
      for (const ingredientId of Object.keys(data)) {
        usedIngredientsSet.add(parseInt(ingredientId, 10));
      }
    }
    const usedIngredientsIds = [...usedIngredientsSet.values()];
    const series = usedIngredientsIds.map((id) => ({
      name: session.ingredients.get(id)?.name,
      data: new Array(orderedResult.length),
    }));
    series.push({
      name: 'Прибыль',
      data: new Array(orderedResult.length),
    });
    for (const [ingredientIndex, ingredientId] of usedIngredientsIds.entries()) {
      const seria = series[ingredientIndex];
      for (const [drinkIndex, [, { data }]] of orderedResult.entries()) {
        seria.data[drinkIndex] = data[ingredientId] || 0;
      }
    }
    for (const [drinkIndex, [, { margin }]] of orderedResult.entries()) {
      series[series.length - 1].data[drinkIndex] = margin;
    }
    return {
      categories,
      series,
    };
  }

  session;

  constructor(session) {
    const filters = new Filters(DECLARE_BEVERAGES_FILTERS(session));

    filters.isShowSearch = false;
    filters.set('device_date', SemanticRanges.prw30Days.resolver());

    const i = { v: 0 };
    super(declareColumns(session), (limit, offset, search) => {
      if (i.v) {
        this.chartData = undefined;
      }
      i.v += 1;
      return getPrimecost(session, (chartData) => {
        this.chartData = chartData;
      })(limit, offset, search);
    }, filters);

    this.session = session;
  }

  toString() {
    return 'ComercePrimecost';
  }

  get isImpossibleToBeSync() { return true; }

  actions = {
    isVisible: true,
    detailsWidget: Details,
  };
}

export default PrimeCost;
