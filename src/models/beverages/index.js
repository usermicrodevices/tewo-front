/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import getBeverages from 'services/beverage';
import TimeAgo from 'elements/timeago';

const COLUMNS = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    isAsyncorder: true,
  },
  cid: {
    isVisbleByDefault: false,
    title: 'Код',
    align: 'right',
    width: 70,
  },
  device_date: {
    isVisbleByDefault: true,
    title: 'Момент налива',
    grow: 1,
    isDefaultSort: true,
    transform: (date) => date && TimeAgo({ date }),
    filter: {
      type: 'dateRange',
      title: 'Момент налива',
    },
    sortDirections: 'both',
  },
  created_date: {
    isVisbleByDefault: false,
    title: 'Время получения данных на сервер',
    grow: 1,
    transform: (date) => date && TimeAgo({ date }),
    sortDirections: 'both',
  },
  device: {
    isVisbleByDefault: true,
    title: 'Устройство',
    align: 'right',
    width: 100,
    filter: {
      type: 'selector',
      title: 'Напиток',
      selector: [1, 2, 3, 4, 5],
      resolver: {
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e',
      },
    },
    sortDirections: 'both',
  },
  drink: {
    isVisbleByDefault: true,
    title: 'Напиток',
    grow: 1,
    filter: {
      type: 'selector',
      title: 'Напиток',
      selector: [1, 2, 3, 4, 5],
      resolver: {
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e',
      },
    },
    sortDirections: 'both',
  },
  operation: {
    isVisbleByDefault: true,
    title: 'Операция',
    grow: 1,
    filter: {
      type: 'selector',
      title: 'Напиток',
      selector: [1, 2, 3, 4, 5],
      resolver: {
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e',
      },
    },
    sortDirections: 'both',
  },
  sale_sum: {
    isVisbleByDefault: true,
    title: 'Стоимость',
    align: 'right',
    width: 100,
    filter: {
      type: 'costRange',
      title: 'Стоимость',
    },
    sortDirections: 'both',
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
