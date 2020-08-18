/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import getSalePoints from 'services/salePoints';
import Filters from 'models/filters';

const COLUMNS = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
    isAsyncorder: true,
  },
  name: {
    isDefaultSort: true,
    isVisbleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
  },
  company: {
    isVisbleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
  },
  tags: {
    isVisbleByDefault: false,
    title: 'Теги',
    grow: 2,
  },
  region: {
    isVisbleByDefault: false,
    title: 'Регоин',
    grow: 2,
  },
  city: {
    isVisbleByDefault: false,
    title: 'Город',
    grow: 2,
  },
  address: {
    isVisbleByDefault: true,
    title: 'Адрес',
    grow: 4,
    sortDirections: 'descend',
  },
  person: {
    isVisbleByDefault: false,
    title: 'Ответственный',
    grow: 2,
  },
  phone: {
    isVisbleByDefault: true,
    title: 'Телефон',
    grow: 2,
  },
  email: {
    isVisbleByDefault: true,
    title: 'Email',
    grow: 2,
  },
  overdueTasks: {
    isVisbleByDefault: true,
    title: 'Количество просроченных задач',
    grow: 2,
  },
  downTime: {
    isVisbleByDefault: true,
    title: 'Суммарный простой',
    grow: 2,
  },
};

class SalePoints extends Table {
  constructor(session) {
    super(COLUMNS, getSalePoints(session), new Filters({}));
  }

  toString() {
    return 'SalePoints';
  }
}

export default SalePoints;
