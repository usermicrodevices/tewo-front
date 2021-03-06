/* eslint class-methods-use-this: off */
import React from 'react';
import { Tooltip } from 'antd';
import { autorun } from 'mobx';
import { daterangeToArgs, SemanticRanges } from 'utils/date';

import { sequentialGet, get } from 'utils/request';
import Table from 'models/table';
import Filters from 'models/filters';
import {
  getEvents, getEventsClearancesChart, getClearances, sendEventsReport,
} from 'services/events';
import colorizedCell from 'elements/table/colorizedCell';
import { eventsLog as eventsLogRout, devices as devicesRout, salePoints as salePointsRout } from 'routes';
import { tableItemLink, durationCell } from 'elements/table/trickyCells';
import Icon from 'elements/icon';
import ExporterToEmail from 'models/exporterToEmail';

const TECH_SERVICE_EVENT_ID = 20;
const infoIcon = <div style={{ textAlign: 'center', width: 38, margin: '0 auto' }}><Icon size="large" name="info-outline" /></div>;

const declareColumns = () => ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 100,
    isAsyncorder: true,
    isDefaultSort: true,
    sortDirections: 'both',
  },
  cid: {
    isVisibleByDefault: false,
    title: 'Код',
    align: 'right',
    width: 70,
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Оборудование',
    grow: 2,
    transform: (v, datum, width) => tableItemLink(v, `${devicesRout.path}/${datum.deviceId}`, width),
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    grow: 2,
    sortDirections: 'both',
    transform: (v, datum, width) => tableItemLink(v, `${salePointsRout.path}/${datum.salePointId}`, width),
  },
  eventName: {
    isVisibleByDefault: true,
    title: 'Тип события',
    grow: 2,
    sortDirections: 'both',
    transform: (_, data, width) => colorizedCell({ children: data.eventName, color: data.eventColor, width }),
  },
  eventPriorityDescription: {
    isVisibleByDefault: true,
    title: 'Категория',
    grow: 1,
    sortDirections: 'both',
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 1,
    sortDirections: 'both',
  },
  duration: {
    isVisibleByDefault: true,
    title: 'Время отклика',
    grow: 2,
    transform: (_, data) => durationCell(data),
    sortDirections: 'both',
  },
  openDate: {
    isVisibleByDefault: false,
    title: 'Время начала',
    width: 189,
    sortDirections: 'both',
  },
  closeDate: {
    isVisibleByDefault: false,
    title: 'Время завершения',
    width: 189,
    sortDirections: 'both',
  },
  eventDescription: {
    isVisibleByDefault: true,
    title: 'Описание',
    width: 84,
    transform: (_, data) => (data.eventDescription ? <Tooltip placement="topRight" width={250} title={data.eventDescription}>{infoIcon}</Tooltip> : ' '),
  },
});

const declareFilters = (session) => ({
  open_date: {
    type: 'daterange',
    title: 'Дата время',
    apply: (general, data) => general(data.openDate),
  },
  device__id: {
    type: 'selector',
    title: 'Оборудование',
    apply: (general, data) => general(data.deviceId),
    selector: (filter) => session.devices.salePointsSelector(filter.data.get('device__sale_point__id')),
  },
  device__sale_point__id: {
    type: 'salepoints',
    apply: (general, data) => general(data.salePointId),
  },
  event_reference__priority__id: {
    type: 'selector',
    title: 'Категория',
    apply: (general, data) => general(data.priority),
    selector: () => session.eventPriorities.selector,
  },
  device__sale_point__company__id: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  event_reference: {
    type: 'selector',
    title: 'Тип события',
    apply: (general, data) => general(data.eventId),
    selector: () => session.eventTypes.selector,
  },
});

class Events extends Table {
  session;

  exporter = null;

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(declareColumns(), getEvents(session, sequentialGet()), filters);
    this.filter.isShowSearch = false;
    this.session = session;

    this.exporter = new ExporterToEmail(sendEventsReport, this.filter, {
      checkDisable: () => !this.filter.data.has('open_date'),
      generateConfirmMessage: () => 'Ссылка будет отправлена на указанную почту, файл храниться 30 дней.',
    });

    autorun(() => {
      this.exporter.onChangeEmail(session?.user?.email || '');
    });
  }

  toString() {
    return 'Events';
  }

  getPathForDevice(deviceId) {
    return `${eventsLogRout.path}/?device__id__in=${deviceId}`;
  }

  getDeviceServiceEvents(deviceId, getter = get) {
    return getEvents(this.session, getter)(1e3, 0, `event_reference__id=${TECH_SERVICE_EVENT_ID}&close_date__isnull=1&device__id__in=${deviceId}`);
  }

  getDeviceClearancesEventsLastWeekCount(deviceId) {
    const daterange = SemanticRanges.prw7Days.resolver();
    const datefilter = daterangeToArgs(daterange, 'open_date');
    return getClearances(this.session)(1, 0, `device__id__in=${deviceId}${datefilter}`).then(({ count }) => count);
  }

  getDeviceClearances(deviceId) {
    return getClearances(this.session)(3e4, 0, `device__id__in=${deviceId}`);
  }

  getClearances = getClearances;

  getOverdueTasks(dateRange, salePointsFilter, getter) {
    const datefilter = daterangeToArgs(dateRange, 'open_date');
    return getEvents(this.session, getter)(3e4, 0, `overdued=1${datefilter}&${salePointsFilter}`);
  }

  getDeviceClearancesChart = getEventsClearancesChart;
}

export default Events;
