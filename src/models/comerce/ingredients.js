/* eslint class-methods-use-this: off */
import { observable } from 'mobx';

import Filters from 'models/filters';
import Table from 'models/table';
import { getIngredientsConsumption } from 'services/ingredients';
import { DECLARE_BEVERAGES_FILTERS } from 'models/beverages';
import Details from 'components/comerce/consumptionDetails';
import { SemanticRanges } from 'utils/date';

const declareColumns = () => ({
  ingredientName: {
    isVisibleByDefault: true,
    title: 'Ингредиент',
    grow: 1,
  },
  measure: {
    isVisibleByDefault: true,
    title: 'Ед. измерения',
    grow: 1,
  },
  count: {
    isVisibleByDefault: true,
    title: 'Кол-во',
    grow: 1,
    sortDirections: 'both',
  },
  cost: {
    isVisibleByDefault: true,
    title: 'Цена',
    grow: 1,
    sortDirections: 'both',
  },
  amount: {
    isVisibleByDefault: true,
    title: 'Сумма',
    grow: 1,
    sortDirections: 'both',
    isDefaultSort: true,
    isAsyncorder: true,
  },
});

class Ingredients extends Table {
  @observable cleans;

  @observable stats = {};

  constructor(session) {
    const filters = new Filters(DECLARE_BEVERAGES_FILTERS(session));

    filters.isShowSearch = false;
    filters.set('device_date', SemanticRanges.prw30Days.resolver());

    super(declareColumns(session), getIngredientsConsumption(session), filters);
  }

  toString() {
    return 'ComerceIngredients';
  }

  get isImpossibleToBeSync() { return true; }

  actions = {
    isVisible: true,
    detailsWidget: Details,
  };
}

export default Ingredients;
