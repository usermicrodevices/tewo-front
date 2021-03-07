/* eslint class-methods-use-this: off */
import React from 'react';
import moment from 'moment';

import Table from 'models/table';
import Filters from 'models/filters';
import Exporter from 'models/exporter';
import { beverage as beverageRout, devices as devicesRout, salePoints as salePointsRout } from 'routes';
import { daterangeToArgs } from 'utils/date';
import plural from 'utils/plural';
import { getBeverages, exportBeverages } from 'services/beverage';
import { OperationIcon, canceledIcon } from 'elements/beverageIcons';
import { tableItemLink } from 'elements/table/trickyCells';

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
    isDefaultSort: true,
    width: 189,
    sortDirections: 'both',
  },
  createdDate: {
    isVisibleByDefault: false,
    title: 'Время получения данных на сервер',
    width: 189,
    sortDirections: 'both',
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Оборудование',
    grow: 1,
    sortDirections: 'both',
    transform: (v, datum, width) => tableItemLink(v, `${devicesRout.path}/${datum.deviceId}`, width),
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    grow: 1,
    sortDirections: 'both',
    transform: (v, datum, width) => tableItemLink(v, `${salePointsRout.path}/${datum.salePointId}`, width),
  },
  drinkName: {
    isVisibleByDefault: true,
    title: 'Напиток',
    grow: 1,
    sortDirections: 'both',
  },
  operationId: {
    isVisibleByDefault: true,
    title: 'Операция',
    grow: 1,
    sortDirections: 'both',
    transform: (operationId, datum) => <OperationIcon id={operationId} description={datum.operationName} />,
  },
  saleSum: {
    isVisibleByDefault: true,
    title: 'Стоимость',
    align: 'right',
    width: 120,
    sortDirections: 'both',
    suffix: '₽',
  },
  canceled: {
    isVisibleByDefault: true,
    title: 'Отменена',
    width: 80,
    transform: (v) => (v ? canceledIcon : ''),
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
    apply: (general, data) => general(data.drinkId),
    selector: () => session.drinks.selector,
  },
  operation__id: {
    type: 'selector',
    title: 'Тип оплаты',
    apply: (general, data) => general(data.sale_sum),
    selector: () => session.beverageOperations.selector,
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

  exporter = null;

  session;

  constructor(session) {
    super(declareColumns(session), getBeverages(session), new Filters(declareFilters(session)));
    this.session = session;
    this.filter.isShowSearch = false;

    this.exporter = new Exporter(exportBeverages, this.filter, {
      checkDisable: () => !this.filter.data.has('device_date') || this.data.length === 0,
      generateFilename: () => `Экспорт_Наливов_${decodeURIComponent(this.filter.search)}__${moment().format('DD-MM-YYYYTHH:mm:ss')}`,
      generateConfirmMessage: () => {
        const dateFormat = 'DD.MM.YYYY HH:mm';
        const count = this.data.length;
        const dateRange = this.filter.data.get('device_date');
        const dateStart = dateRange[0].format(dateFormat);
        const dateEnd = dateRange[1].format(dateFormat);

        return `Выгрузить ${count} ${plural(count, ['запись', 'записи', 'записей'])} по наливам с ${dateStart} по ${dateEnd}?`;
      },
    });
  }

  toString() {
    return 'Beverages';
  }

  getPathForDevice(deviceId) {
    return `${beverageRout.path}/?device__id__in=${deviceId}`;
  }

  getBeveragesForDevice(deviceId, limit, daterange) {
    const rangeArg = typeof daterange === 'undefined'
      ? ''
      : daterangeToArgs(daterange, 'device_date');
    return getBeverages(this.session)(limit, 0, `device__id__in=${deviceId}${rangeArg}`);
  }
}

export { Beverages as default, declareFilters as DECLARE_BEVERAGES_FILTERS };
