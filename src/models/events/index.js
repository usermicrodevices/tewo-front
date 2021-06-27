/* eslint class-methods-use-this: off */
import React from 'react';
import { Tooltip } from 'antd';
import { daterangeToArgs, SemanticRanges } from 'utils/date';
import plural from 'utils/plural';
import Table from 'models/table';
import Filters from 'models/filters';
import Exporter from 'models/exporter';
import {
  getEvents, getEventsClearancesChart, getClearances, exportEvents,
} from 'services/events';
import colorizedCell from 'elements/table/colorizedCell';
import { eventsLog as eventsLogRout, devices as devicesRout, salePoints as salePointsRout } from 'routes';
import { tableItemLink, durationCell } from 'elements/table/trickyCells';
import Icon from 'elements/icon';

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
    grow: 1,
    transform: (v, datum, width) => tableItemLink(v, `${devicesRout.path}/${datum.deviceId}`, width),
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    grow: 1,
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
    title: 'Длительность',
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
    transform: (_, data) => <Tooltip placement="topRight" width={250} title={data.eventDescription}>{infoIcon}</Tooltip>,
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
    type: 'selector',
    title: 'Объект',
    apply: (general, data) => general(data.salePointId),
    selector: () => session.points.selector,
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
    super(declareColumns(), getEvents(session), filters);
    this.filter.isShowSearch = false;
    this.session = session;

    this.exporter = new Exporter(exportEvents, this.filter, {
      checkDisable: () => !this.filter.data.has('open_date') || this.data.length === 0,
      generateFilename: () => {
        const dateFormat = 'DD.MM-YYYY';
        const dateRange = this.filter.data.get('open_date');
        const dateStart = dateRange[0].format(dateFormat);
        const dateEnd = dateRange[1].format(dateFormat);

        return `События_${dateStart}-${dateEnd}`;
      },
      generateConfirmMessage: () => {
        const dateFormat = 'DD.MM.YYYY HH:mm';
        const count = this.data.length;
        const dateRange = this.filter.data.get('open_date');
        const dateStart = dateRange[0].format(dateFormat);
        const dateEnd = dateRange[1].format(dateFormat);

        return `Выгрузить ${count} ${plural(count, ['запись', 'записи', 'записей'])} по событиям с ${dateStart} по ${dateEnd}?`;
      },
    });
  }

  toString() {
    return 'Events';
  }

  getPathForDevice(deviceId) {
    return `${eventsLogRout.path}/?device__id__in=${deviceId}`;
  }

  getDeviceServiceEvents(deviceId) {
    return getEvents(this.session)(1e3, 0, `event_reference__id=${TECH_SERVICE_EVENT_ID}&close_date__isnull=1&device__id__in=${deviceId}`);
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

  getOverdueTasks(dateRange, salePointsFilter) {
    const datefilter = daterangeToArgs(dateRange, 'open_date');
    return getEvents(this.session)(3e4, 0, `overdued=1${datefilter}&${salePointsFilter}`);
  }

  getDeviceClearancesChart = getEventsClearancesChart;
}

export default Events;
