/* eslint class-methods-use-this: off */
import { observable, reaction } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import { getClearances, getDetergents } from 'services/events';
import { tableItemLink, durationCell } from 'elements/table/trickyCells';
import { sequentialGet } from 'utils/request';
import { devices as devicesRout, salePoints as salePointsRout } from 'routes';

import ClearancesCalendar from './clearancesCalendar';

const declareColumns = () => ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 100,
    isAsyncorder: true,
    isDefaultSort: true,
    sortDirections: 'both',
  },
  openDate: {
    isVisibleByDefault: false,
    title: 'Время начала',
    width: 189,
    sortDirections: 'both',
  },
  duration: {
    isVisibleByDefault: true,
    title: 'Длительность',
    grow: 2,
    transform: (_, data) => durationCell(data),
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
  eventDescription: {
    isVisibleByDefault: true,
    title: 'Описание',
    grow: 2,
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
  device__sale_point__company__id: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
});

class Clearances extends Table {
  session;

  calendar;

  @observable stats;

  sequentialDetergetnsGetter = sequentialGet();

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(declareColumns(), getClearances(session, sequentialGet()), filters);
    this.filter.isShowSearch = false;
    this.session = session;
    this.calendar = new ClearancesCalendar(this, session);

    const update = () => {
      this.stats = {};
      getDetergents(filters.search, this.sequentialDetergetnsGetter).then((stats) => { this.stats = stats; });
    };

    reaction(() => filters.search, update);
    update();
  }

  toString() {
    return 'Clearances';
  }
}

export default Clearances;
