/* eslint class-methods-use-this: off */
import { observable, computed, action } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import { applyDrink, getDrinks } from 'services/drinks';
import cup from 'elements/cup';

import { drink as drinksRout } from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';
import Drink from './drink';

import RecipeEditor from './recipeEditor';

const declareColumns = (onEditRecipe) => ({
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
    transform: (_, datum, width) => tableItemLink(datum.name, `${drinksRout.path}/${datum.id}`, width),
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 3,
    sortDirections: 'both',
  },
  plu: {
    isVisibleByDefault: true,
    title: 'Код PLU',
    grow: 2,
    sortDirections: 'both',
  },
  recipe: {
    isVisibleByDefault: true,
    title: 'Рецепт',
    width: 70,
    transform: (_, datum) => cup(() => { onEditRecipe(datum); }, datum.isHaveRecipe),
  },
});

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  isHaveRecipe: {
    type: 'checkbox',
    title: 'Заполнена ли рецептура',
    apply: (_, data) => data.isHaveRecipe,
    passiveValue: false,
  },
});

class Drinks extends Table {
  chart = null;

  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  actions;

  session;

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
  };

  constructor(session) {
    super(declareColumns((drink) => {
      this.elementForEdit = new RecipeEditor(drink, this.session);
    }), getDrinks(session), new Filters(declareFilters(session)));

    this.session = session;
  }

  toString() {
    return 'Drinks';
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  @action editRecipe(drink) {

  }

  get(typeId) {
    return this.rawData.find(({ id }) => id === typeId);
  }

  update = applyDrink;

  @action create() {
    const itm = new Drink(this.session);
    this.elementForEdit = itm;
    itm.onCreated = () => {
      this.rawData.push(itm);
    };
  }
}

export default Drinks;
