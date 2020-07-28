/* eslint class-methods-use-this: "off" */
import Table from 'models/table';

const COLUMNS_LIST = {
  id: {
    bydefault: true,
    title: 'ID',
    width: 70,
    sortDefault: true,
    sortDirections: 'descend',
  },
  name: {
    bydefault: true,
    title: 'Название',
    grow: 4,
    sortDirections: 'both',
  },
  location: {
    bydefault: true,
    title: 'Город',
    grow: 2,
    sortDirections: 'both',
  },
  objectsCount: {
    bydefault: true,
    title: 'Кол-во объектов',
    align: 'right',
    width: 120,
    sortDirections: 'both',
  },
  actions: {
    bydefault: false,
    title: 'Действия',
    grow: 2,
  },
  inn: {
    bydefault: false,
    title: 'ИНН',
    grow: 2,
  },
  account: {
    bydefault: false,
    title: 'Реквизиты',
    grow: 2,
  },
};

class Companies extends Table {
  constructor(session) {
    super(COLUMNS_LIST);

    session.companies
      .then((companies) => {
        this.data = this.applySort(companies);
      })
      .catch((err) => {
        this.data = err;
      });
  }

  toString() {
    return 'Companies';
  }
}

export default Companies;
