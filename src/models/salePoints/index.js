import Table from 'models/table';

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
  location: {
    bydefault: true,
    title: 'Город',
    grow: 2,
    sortDirections: 'both',
  },
  actions: {
    bydefault: false,
    title: 'Действия',
    grow: 2,
  },
};

class SalePoints extends Table {
  constructor() {
    super(COLUMNS);
  }
}

export default SalePoints;
