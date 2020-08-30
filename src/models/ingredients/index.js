/* eslint class-methods-use-this: "off" */
import { observable } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import getIngridients from 'services/ingredients';

const COLUMNS = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
  },
  name: {
    isDefaultSort: true,
    isVisbleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
  },
  companyName: {
    isVisbleByDefault: true,
    title: 'Цена за единицу',
    grow: 3,
    sortDirections: 'both',
  },
  plu: {
    isVisbleByDefault: true,
    title: 'Валюта',
    grow: 2,
    sortDirections: 'both',
  },
  consept: {
    isVisbleByDefault: true,
    title: 'Единица измерения',
    grow: 2,
    sortDirections: 'both',
  },
  consept: {
    isVisbleByDefault: true,
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

  get selector() {
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  get(typeId) {
    return this.rawData.find(({ id }) => id === typeId);
  }
}

export default Ingridients;
