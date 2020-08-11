/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import getCompanies from 'services/companies';

const COLUMNS_LIST = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    isDefaultSort: true,
    sortDirections: 'descend',
    isAsyncorder: true,
  },
  name: {
    isVisbleByDefault: true,
    title: 'Название',
    grow: 4,
    sortDirections: 'both',
  },
  location: {
    isVisbleByDefault: true,
    title: 'Город',
    grow: 2,
    sortDirections: 'both',
  },
  objectsCount: {
    isVisbleByDefault: true,
    title: 'Кол-во объектов',
    align: 'right',
    width: 120,
    sortDirections: 'both',
  },
  actions: {
    isVisbleByDefault: false,
    title: 'Действия',
    grow: 2,
  },
  inn: {
    isVisbleByDefault: false,
    title: 'ИНН',
    grow: 2,
  },
  account: {
    isVisbleByDefault: false,
    title: 'Реквизиты',
    grow: 2,
  },
};

class Companies extends Table {
  constructor(session) {
    super(getCompanies, COLUMNS_LIST);
  }

  toString() {
    return 'Companies';
  }
}

export default Companies;
