/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import getSalePoints from 'services/salePoints';

const COLUMNS = {
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
  company: {
    isVisbleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
    transform: (data) => data && data.name,
  },
  createdDate: {
    isVisbleByDefault: true,
    title: 'Дата подключения',
    grow: 2,
    sortDirections: 'descend',
    transform: (data) => new Date(data).toDateString(),
  },
  address: {
    isVisbleByDefault: true,
    title: 'Адрес',
    grow: 2,
    sortDirections: 'descend',
  },
  mapPoint: {
    isVisbleByDefault: true,
    title: 'Расположение',
    grow: 2,
    sortDirections: 'descend',
  },
  actions: {
    isVisbleByDefault: false,
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
