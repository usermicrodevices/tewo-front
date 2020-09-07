/* eslint class-methods-use-this: "off" */
import { observable, computed } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import getDrinks from 'services/drinks';
import RecipeEditor from './recipeEditor';

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
    title: 'Компания',
    grow: 3,
    sortDirections: 'both',
  },
  plu: {
    isVisbleByDefault: true,
    title: 'Код PLU',
    grow: 2,
    sortDirections: 'both',
  },
  consept: {
    isVisbleByDefault: true,
    title: 'Концепция',
    grow: 2,
    sortDirections: 'both',
  },
};

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

  constructor(session) {
    super(COLUMNS, getDrinks(session), new Filters(declareFilters(session)));

    this.actions = {
      isVisible: true,
      isEditable: () => true,
      isRecipeEditable: () => true,
      isHaveRecipe: ({ isHaveRecipe }) => isHaveRecipe,
      onEdit: (datum) => {
        this.elementForEdit = datum;
      },
      onFillRecipe: (datum) => {
        this.elementForEdit = new RecipeEditor(datum, session);
      },
    };
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

  get(typeId) {
    return this.rawData.find(({ id }) => id === typeId);
  }
}

export default Drinks;
