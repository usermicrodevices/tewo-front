/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import getBeverages from 'services/beverage';
import TimeAgo from 'elements/timeago';

const COLUMNS = {
  id: {
    bydefault: true,
    title: 'ID',
    width: 70,
  },
  device_date: {
    bydefault: true,
    title: 'Момент налива',
    grow: 1,
    sortDirections: 'both',
    sortDefault: true,
    transform: (date) => date && TimeAgo({ date }),
  },
  cid: {
    bydefault: true,
    title: 'Код',
    align: 'right',
    width: 70,
  },
  device: {
    bydefault: true,
    title: 'Устройство',
    align: 'right',
    width: 100,
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
