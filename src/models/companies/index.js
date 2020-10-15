/* eslint class-methods-use-this: off */
import { observable, computed } from 'mobx';

import Table from 'models/table';
import getCompanies from 'services/companies';
import Filters from 'models/filters';
import { linkedCell } from 'elements/table/trickyCells';

const COLUMNS_LIST = () => ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
    isAsyncorder: true,
  },
  name: {
    isVisibleByDefault: true,
    title: 'Название',
    grow: 4,
    sortDirections: 'both',
    isDefaultSort: true,
  },
  created: {
    isVisibleByDefault: true,
    title: 'Регистрация в системе',
    grow: 2,
    transform: (date) => date.format('D MMMM yyyy'),
    sortDirections: 'both',
  },
  pointsAmount: {
    isVisibleByDefault: true,
    title: 'Кол-во объектов',
    align: 'right',
    width: 120,
    sortDirections: 'both',
  },
});

class Companies extends Table {
  chart = null;

  title = {
    name: 'Список объектов',
  };

  get isImpossibleToBeAsync() { return true; }

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
  };

  @observable elementForEdit = undefined;

  session;

  constructor(session) {
    const columns = COLUMNS_LIST();
    const onClick = (datum) => () => { this.actions.onEdit(datum); };
    columns.name.transform = linkedCell(onClick);
    super(columns, getCompanies(session), new Filters({}));

    this.session = session;
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  toString() {
    return 'Companies';
  }

  getSubset(idsSubset) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ id }) => idsSubset.has(id));
  }

  get(companyId) {
    return this.rawData.find(({ id }) => companyId === id);
  }
}

export default Companies;
