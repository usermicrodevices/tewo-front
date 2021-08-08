/* eslint class-methods-use-this: off */
import {
  computed, observable, reaction, action,
} from 'mobx';
import moment from 'moment';

import Table from 'models/table';
import Filters from 'models/filters';
import { getOverdued, getDowntimes } from 'services/events';
import colorizedCell from 'elements/table/colorizedCell';
import { tableItemLink } from 'elements/table/trickyCells';
import { devices as devicesRout, salePoints as salePointsRout } from 'routes';
import { SemanticRanges } from 'utils/date';
import { sequentialGet } from 'utils/request';

const declareColumns = () => ({
  id: {
    isVisibleByDefault: false,
    title: 'ID',
    width: 100,
    isAsyncorder: true,
    isDefaultSort: true,
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
    grow: 1.5,
    sortDirections: 'both',
    transform: (v, datum, width) => tableItemLink(v, `${salePointsRout.path}/${datum.salePointId}`, width),
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Оборудование',
    grow: 1.5,
    transform: (v, datum, width) => tableItemLink(v, `${devicesRout.path}/${datum.deviceId}`, width),
  },
  eventName: {
    isVisibleByDefault: true,
    title: 'Тип события',
    grow: 1,
    sortDirections: 'both',
    transform: (_, data, width) => colorizedCell({ children: data.eventName, color: data.eventColor, width }),
  },
  eventDescription: {
    isVisibleByDefault: true,
    title: 'Описание',
    grow: 1,
  },
  duration: {
    isVisibleByDefault: true,
    title: 'Время отклика',
    grow: 1,
    transform: (duration) => moment.duration(duration, 'second').humanize(),
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
  event_reference: {
    type: 'selector',
    title: 'Тип события',
    apply: (general, data) => general(data.eventId),
    selector: () => session.eventTypes.selector,
  },
});

class Overdue extends Table {
  session;

  @observable downtimes;

  @observable selectedPointId = null;

  lastChartSearch = null;

  internalPrevent = false;

  setAdditionalFilterPoint = (id) => {
    if (this.internalPrevent) {
      this.internalPrevent = false;
      return;
    }
    this.selectedPointId = id;
    this.filter.data[typeof id === 'number' ? 'set' : 'delete'](
      'device__sale_point__id', id ? [this.downtimes[id].salePointId] : undefined,
    );
  }

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(declareColumns(), getOverdued(session, sequentialGet()), filters);
    this.filter.isShowSearch = false;
    this.filter.set('open_date', SemanticRanges.prw30Days.resolver());
    this.session = session;

    const update = () => {
      const newFilter = this.filter.search.replace(/[&]?device__sale_point__id__in=[\d,]+/, '');
      console.log(this.lastChartSearch, newFilter);
      if (this.lastChartSearch !== newFilter) {
        this.downtimes = undefined;
        this.lastChartSearch = newFilter;
        getDowntimes(newFilter, sequentialGet()).then((downtimes) => {
          this.downtimes = downtimes.sort((a, b) => Math.sign(b.downtime - a.downtime));
        });
      }
    };
    reaction(() => this.filter.search, update);
    reaction(() => this.filter.search, () => {
      const cur = this.filter.data.get('device__sale_point__id');
      if (cur?.length !== 1) {
        this.internalPrevent = true;
        this.selectedPointId = null;
        return;
      }
      if (this.downtimes && this.downtimes[this.selectedPointId].salePointId !== cur[0]) {
        const id = this.downtimes.findIndex(({ salePointId }) => salePointId === cur[0]);
        if (id > 0) {
          this.setAdditionalFilterPoint(id);
        }
      }
    });
    update();
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

  @computed get pointsDowntimes() {
    if (!this.session.points.isLoaded || typeof this.downtimes === 'undefined') {
      return undefined;
    }
    const points = new Set(this.downtimes.map(({ salePointId }) => salePointId));
    const resolver = {};
    for (const point of this.session.points.getSubset(points)) {
      resolver[point.id] = point;
    }
    return this.downtimes.map(({ salePointId, downtime }) => (
      { name: resolver[salePointId].name, downtime }
    ));
  }

  @computed get downtime() {
    if (typeof this.downtimes === 'undefined') {
      return undefined;
    }
    let sum = 0;
    for (const { downtime } of this.downtimes) {
      sum += downtime;
    }
    return sum;
  }

  get isImpossibleToBeSync() { return true; }
}

export default Overdue;
