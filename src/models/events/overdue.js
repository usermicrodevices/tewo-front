/* eslint class-methods-use-this: off */
import { computed, reaction } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import { getOverdued } from 'services/events';
import colorizedCell from 'elements/table/colorizedCell';
import { tableItemLink } from 'elements/table/trickyCells';
import TimeAgo from 'elements/timeago';
import { devices as devicesRout, salePoints as salePointsRout } from 'routes';

import ClearancesCalendar from './clearancesCalendar';

const declareColumns = () => ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 100,
    isAsyncorder: true,
    isDefaultSort: true,
    sortDirections: 'descend',
  },
  createdDate: {
    isVisibleByDefault: false,
    title: 'Время начала',
    grow: 1,
    transform: (date) => date && TimeAgo({ date }),
    sortDirections: 'both',
  },
  duration: {
    isVisibleByDefault: true,
    title: 'Длительность',
    grow: 2,
    transform: (_, data) => data.durationText,
    sortDirections: 'both',
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 1,
    sortDirections: 'both',
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    grow: 1,
    sortDirections: 'both',
    transform: (v, datum, width) => tableItemLink(v, `${salePointsRout.path}/${datum.salePointId}`, width),
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Оборудование',
    grow: 1,
    transform: (v, datum, width) => tableItemLink(v, `${devicesRout.path}/${datum.deviceId}`, width),
  },
  eventName: {
    isVisibleByDefault: true,
    title: 'Тип события',
    grow: 2,
    sortDirections: 'both',
    transform: (_, data, width) => colorizedCell({ children: data.eventName, color: data.eventColor, width }),
  },
  eventDescription: {
    isVisibleByDefault: true,
    title: 'Описание',
    grow: 2,
  },
});

const declareFilters = (session) => ({
  open_date: {
    type: 'datetimerange',
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
});

class Overdue extends Table {
  session;

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(declareColumns(), getOverdued(session), filters);
    this.filter.isShowSearch = false;
    this.session = session;
  }

  toString() {
    return 'Overdue';
  }

  @computed get amount() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.data.length;
  }

  @computed get devices() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    const deviceList = this.filter.data.get('device__id');
    const pointsList = this.filter.data.get('device__sale_point__id');
    const devices = deviceList ? new Set(deviceList) : { has: () => true };
    const points = pointsList && !deviceList ? new Set(pointsList) : { has: () => true };
    return this.session.devices.rawData.filter(({ id, salePointId, downtime }) => devices.has(id) && points.has(salePointId) && downtime > 0);
  }

  @computed get downtime() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    let result = 0;
    for (const { downtime } of this.devices) {
      result += downtime;
    }
    return result;
  }
}

export default Overdue;
