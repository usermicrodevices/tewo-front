/* eslint class-methods-use-this: off */
import { observable, computed } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import getIngridients from 'services/ingredients';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
  },
  name: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
  },
  cost: {
    isVisibleByDefault: true,
    title: 'Цена за единицу',
    grow: 3,
    sortDirections: 'both',
  },
  currency: {
    isVisibleByDefault: true,
    title: 'Валюта',
    grow: 2,
    sortDirections: 'both',
  },
  dimension: {
    isVisibleByDefault: true,
    title: 'Единица измерения',
    grow: 2,
    sortDirections: 'both',
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
  },
};

const declareFilters = (session) => ({
});

class Ingridients extends Table {
  chart = null;

  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
  };

  constructor(session) {
    super(COLUMNS, getIngridients(session), new Filters(declareFilters(session)));
  }

  toString() {
    return 'Ingridients';
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  get(typeId) {
    return this.rawData.find(({ id }) => id === typeId);
  }
}

export default Ingridients;
