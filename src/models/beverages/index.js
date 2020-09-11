/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import Filters from 'models/filters';
import { getBeverages } from 'services/beverage';
import TimeAgo from 'elements/timeago';

const declareColumns = (session) => ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 110,
    isAsyncorder: true,
  },
  cid: {
    isVisibleByDefault: false,
    title: 'Код',
    align: 'right',
    width: 70,
  },
  deviceDate: {
    isVisibleByDefault: true,
    title: 'Момент налива',
    grow: 1,
    isDefaultSort: true,
    transform: (date) => (+date && TimeAgo({ date })) || null,
    sortDirections: 'both',
  },
  createdDate: {
    isVisibleByDefault: false,
    title: 'Время получения данных на сервер',
    grow: 1,
    transform: (date) => (+date && TimeAgo({ date })) || null,
    sortDirections: 'both',
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Устройство',
    align: 'right',
    grow: 1,
    sortDirections: 'both',
  },
  drinkName: {
    isVisibleByDefault: true,
    title: 'Напиток',
    grow: 1,
    sortDirections: 'both',
  },
  operationName: {
    isVisibleByDefault: true,
    title: 'Операция',
    grow: 1,
    sortDirections: 'both',
  },
  saleSum: {
    isVisibleByDefault: true,
    title: 'Стоимость',
    align: 'right',
    width: 100,
    sortDirections: 'both',
  },
});

const declareFilters = (session) => ({
  device_date: {
    type: 'daterange',
    title: 'Момент налива',
    apply: (general, data) => general(data.deviceDate),
  },
  device__sale_point__company__id: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  device__sale_point__id: {
    type: 'selector',
    title: 'Объект',
    apply: (general, data) => general(data.salePointId),
    selector: () => session.points.selector,
  },
  device__id: {
    type: 'selector',
    title: 'Оборудование',
    apply: (general, data) => general(data.deviceId),
    selector: (filter) => session.devices.salePointsSelector(filter.data.get('sale_point__id')),
  },
  drink__id: {
    type: 'selector',
    title: 'Напиток',
    apply: (general, data) => general(data.drink),
    selector: () => session.drinks.selector,
    disabled: (filter) => !filter.data.has('device__id'),
  },
  operation__id: {
    type: 'selector',
    title: 'Тип оплаты',
    apply: (general, data) => general(data.sale_sum),
    selector: () => session.beverageOperations.selector,
    disabled: true,
  },
  canceled: {
    type: 'checkbox',
    title: 'Отмемённые',
    apply: (_, data) => data.canceled,
    passiveValue: false,
  },
});

class Beverages extends Table {
  chart = null;

  constructor(session) {
    super(declareColumns(session), getBeverages(session), new Filters(declareFilters(session)));
    this.filter.isShowSearch = false;
  }

  toString() {
    return 'Beverages';
  }
}

export default Beverages;
