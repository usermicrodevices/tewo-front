/* eslint class-methods-use-this: "off" */
import { observable } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import getDrinks from 'services/drinks';
import FormulaEditor from './formulaEditor';

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
  company: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  isHaveFormula: {
    type: 'checkbox',
    title: 'Заполнена ли рецептура',
    apply: (_, data) => data.isHaveFormula,
    passiveValue: false,
  },
});

class Drinks extends Table {
  chart = null;

  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  actions = {
    isVisible: true,
    isEditable: () => true,
    isFormulaEditable: () => true,
    isHaveFormula: ({ isHaveFormula }) => isHaveFormula,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
    onFillFormula: (datum) => {
      this.elementForEdit = new FormulaEditor(datum);
    },
  };

  constructor(session) {
    super(COLUMNS, getDrinks(session), new Filters(declareFilters(session)));
  }

  toString() {
    return 'Drinks';
  }

  get selector() {
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  get(typeId) {
    return this.rawData.find(({ id }) => id === typeId);
  }
}

export default Drinks;
