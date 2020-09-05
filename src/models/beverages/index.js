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
  deviceDate: {
    isVisbleByDefault: true,
    title: 'Момент налива',
    grow: 1,
    isDefaultSort: true,
    transform: (date) => (+date && TimeAgo({ date })) || null,
    sortDirections: 'both',
  },
  createdDate: {
    isVisbleByDefault: false,
    title: 'Время получения данных на сервер',
    grow: 1,
    transform: (date) => (+date && TimeAgo({ date })) || null,
    sortDirections: 'both',
  },
  deviceName: {
    isVisbleByDefault: true,
    title: 'Устройство',
    align: 'right',
    grow: 1,
    sortDirections: 'both',
  },
  drinkName: {
    isVisbleByDefault: true,
    title: 'Напиток',
    grow: 1,
    sortDirections: 'both',
  },
  operationName: {
    isVisbleByDefault: true,
    title: 'Операция',
    grow: 1,
    sortDirections: 'both',
  },
  saleSum: {
    isVisbleByDefault: true,
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
    apply: (general, data) => general(data.device_date),
  },
  company__id: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  sale_point__id: {
    type: 'selector',
    title: 'Объект',
    apply: (general, data) => general(data.salePointId),
    selector: () => session.points.selector,
  },
  device__id: {
    type: 'selector',
    title: 'Оборудование',
    apply: (general, data) => general(data.drink),
    selector: (filter) => session.devices.salePointsSelector(filter.data.sale_point),
  },
  drink__id: {
    type: 'selector',
    title: 'Напиток',
    apply: (general, data) => general(data.drink),
    selector: () => session.drinks.selector,
    disabled: (filter) => !filter.data.device,
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
  }

  toString() {
    return 'Beverages';
  }
}

export default Beverages;
