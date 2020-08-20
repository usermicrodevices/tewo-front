/* eslint class-methods-use-this: "off" */

import Table from 'models/table';
import getCompanies from 'services/companies';
import Filters from 'models/filters';
import { observable, transaction } from 'mobx';

const COLUMNS_LIST = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
    isAsyncorder: true,
  },
  name: {
    isVisbleByDefault: true,
    title: 'Название',
    grow: 4,
    sortDirections: 'both',
    isDefaultSort: true,
  },
  created: {
    isVisbleByDefault: true,
    title: 'Регистрация в системе',
    grow: 2,
    transform: (date) => date.format('D MMMM yyyy'),
    sortDirections: 'both',
  },
  pointsAmount: {
    isVisbleByDefault: true,
    title: 'Кол-во объектов',
    align: 'right',
    width: 120,
    sortDirections: 'both',
  },
};

class Companies extends Table {
  chart = null;

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
  };

  @observable elementForEdit = undefined;

  constructor(session) {
    super(COLUMNS_LIST, getCompanies(session), new Filters());
  }

  toString() {
    return 'Companies';
  }
}

export default Companies;
