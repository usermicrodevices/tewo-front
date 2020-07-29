/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import getBeverages from 'services/beverage';

const COLUMNS = {
  id: {
    bydefault: true,
    title: 'ID',
    width: 70,
  },
  created_date: {
    bydefault: true,
    title: 'Момент налива',
    grow: 1,
    sortDirections: 'descend',
    sortDefault: true,
  },
  cid: {
    bydefault: true,
    title: 'Код',
    align: 'right',
    grow: 1,
  },
  device: {
    bydefault: true,
    title: 'Устройство',
    grow: 1,
  },
};

class Beverages extends Table {
  constructor() {
    super(getBeverages, COLUMNS);
  }

  toString() {
    return 'Beverages';
  }
}

export default Beverages;
