/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import getSalePoints from 'services/salePoints';

const COLUMNS = {
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
  company: {
    bydefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
    transform: (data) => data && data.name,
  },
  createdDate: {
    bydefault: true,
    title: 'Дата подключения',
    grow: 2,
    sortDirections: 'descend',
    transform: (data) => new Date(data).toDateString(),
  },
  address: {
    bydefault: true,
    title: 'Адрес',
    grow: 2,
    sortDirections: 'descend',
  },
  mapPoint: {
    bydefault: true,
    title: 'Расположение',
    grow: 2,
    sortDirections: 'descend',
  },
  actions: {
    bydefault: false,
    title: 'Действия',
    grow: 2,
  },
};

class SalePoints extends Table {
  constructor(session) {
    super(getSalePoints(session), COLUMNS);
  }

  toString() {
    return 'SalePoints';
  }
}

export default SalePoints;
