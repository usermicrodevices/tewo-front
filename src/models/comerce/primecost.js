/* eslint class-methods-use-this: off */
import { observable } from 'mobx';

import Filters from 'models/filters';
import Table from 'models/table';
import { getPrimecost } from 'services/comerce';
import { DECLARE_BEVERAGES_FILTERS } from 'models/beverages';
import Details from 'components/comerce/primecost/details';

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
    isDefaultSort: true,
    isAsyncorder: true,
  },
  margin: { // earn - cost
    isVisibleByDefault: true,
    title: 'Маржа',
    grow: 1,
    sortDirections: 'both',
    isDefaultSort: true,
    isAsyncorder: true,
  },
});

class PrimeCost extends Table {
  @observable cleans;

  @observable stats = {};

  constructor(session) {
    const filters = new Filters(DECLARE_BEVERAGES_FILTERS(session));

    filters.isShowSearch = false;

    super(declareColumns(session), getPrimecost(session), filters);
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
