/* eslint class-methods-use-this: off */
import { observable, computed, action } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import { getIngredients, applyIngredient, deleteIngredient } from 'services/ingredients';

import Ingredient from './ingredient';

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
  currencyName: {
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
  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  session;

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
    onDelete: (datum) => {
      deleteIngredient(datum.id).then(this.rawData.splice(this.rawData.findIndex((d) => d === datum), 1));
    },
  };

  constructor(session) {
    super(COLUMNS, getIngredients(session), new Filters(declareFilters(session)));
    this.session = session;
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

  update = applyIngredient;

  @action create() {
    const itm = new Ingredient(this.session);
    this.elementForEdit = itm;
    itm.onCreated = () => {
      this.rawData.push(itm);
    };
  }
}

export default Ingridients;
