/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import Filters from 'models/filters';
import { getBeverages } from 'services/beverage';
import TimeAgo from 'elements/timeago';

const declareColumns = (session) => ({
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 100,
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
    grow: 1,
    sortDirections: 'both',
    transform: (device) => {
      if (typeof device !== 'number') {
        return device;
      }
      return (session.devices.get(device) || { name: undefined }).name;
    },
  },
  drink: {
    isVisbleByDefault: true,
    title: 'Напиток',
    grow: 1,
    sortDirections: 'both',
    transform: (drink) => {
      if (typeof drink !== 'number') {
        return drink;
      }
      return (session.drinks.get(drink) || { name: undefined }).name;
    },
  },
  operation: {
    isVisbleByDefault: true,
    title: 'Операция',
    grow: 1,
    sortDirections: 'both',
    transform: (op) => {
      if (typeof op !== 'number') {
        return op;
      }
      return session.beverageOperations.get(op);
    },
  },
  sale_sum: {
    isVisbleByDefault: true,
    title: 'Стоимость',
    align: 'right',
    width: 100,
    sortDirections: 'both',
  },
});

const declareFilters = (session) => ({
  sale_sum: {
    type: 'costrange',
    title: 'Стоимость',
    apply: (general, data) => general(data.sale_sum),
  },
  drink: {
    type: 'selector',
    title: 'Напиток',
    apply: (general, data) => general(data.drink),
    selector: () => [
      [1, 'a'], [2, 'b'],
    ],
  },
  operation: {
    type: 'selector',
    title: 'Операция',
    apply: (general, data) => general(data.operation),
    selector: () => [
      [1, 'a'], [2, 'b'],
    ],
  },
  device_date: {
    type: 'daterange',
    title: 'Момент налива',
    apply: (general, data) => general(data.device_date),
  },
});

class Beverages extends Table {
  chart = null;

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(declareColumns(session), getBeverages, filters);
  }

  toString() {
    return 'Beverages';
  }
}

export default Beverages;
