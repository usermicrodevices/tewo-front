/* eslint class-methods-use-this: off */
import { observable, action } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import { getIngredients, applyIngredient, deleteIngredient } from 'services/ingredients';
import { FORMAT } from 'elements/format';
import { sophisticatedPopconfirm } from 'elements/table/trickyCells';

import Ingredient from './ingredient';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
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
    transform: (v) => (typeof v === 'number' ? FORMAT.format(v.toString()) : undefined),
    sortDirections: 'both',
  },
  currencyName: {
    isVisibleByDefault: true,
    title: 'Валюта',
    grow: 2,
    sortDirections: 'both',
  },
  measureUnit: {
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
    deleteConfirm: sophisticatedPopconfirm,
  };

  constructor(session) {
    super(COLUMNS, getIngredients(session), new Filters({
      companyId: {
        type: 'singleselector',
        title: 'Компания',
        apply: (general, data) => general(data.companyId),
        selector: () => session.companies.selector,
      },
      drinksId: {
        type: 'selector',
        title: 'Напиток',
        apply: (general, data) => data.drinksId.findIndex((drinkId) => general(drinkId)) >= 0,
        selector: () => session.drinks.selector,
      },
    }));
    this.session = session;
  }

  toString() {
    return 'Ingridients';
  }

  getSelector(filterPredicate) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(filterPredicate).map(({ id, name }) => [id, name]);
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
