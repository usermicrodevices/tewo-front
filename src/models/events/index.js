/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import Filters from 'models/filters';
import { getEvents } from 'services/events';
import TimeAgo from 'elements/timeago';

const declareColumns = () => ({
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    isAsyncorder: true,
    isDefaultSort: true,
    sortDirections: 'descend',
  },
  cid: {
    isVisbleByDefault: false,
    title: 'Код',
    align: 'right',
    width: 70,
  },
  eventName: {
    isVisbleByDefault: true,
    title: 'Тип события',
    grow: 1,
    sortDirections: 'both',
  },
  eventPriority: {
    isVisbleByDefault: true,
    title: 'Приоритет события',
    grow: 1,
    sortDirections: 'both',
  },
  companyName: {
    isVisbleByDefault: true,
    title: 'Компания',
    grow: 1,
    sortDirections: 'both',
  },
  duration: {
    isVisbleByDefault: true,
    title: 'Длительность',
    grow: 2,
    transform: (_, data) => data.durationText,
    sortDirections: 'both',
  },
  createdDate: {
    isVisbleByDefault: false,
    title: 'Время начала',
    grow: 1,
    transform: (date) => date && TimeAgo({ date }),
    sortDirections: 'both',
  },
  closeDate: {
    isVisbleByDefault: false,
    title: 'Время завершения',
    grow: 1,
    transform: (date) => date && TimeAgo({ date }),
    sortDirections: 'both',
  },
});

const declareFilters = (session) => ({
  start_date: {
    type: 'daterange',
    title: 'Дата время',
    apply: (general, data) => general(data.startDate),
  },
  device_id: {
    type: 'selector',
    title: 'Оборудование',
    apply: (general, data) => general(data.device_id),
    selector: () => session.devices.selector,
  },
  sale_point_id: {
    type: 'selector',
    title: 'Объект',
    apply: (general, data) => general(data.sale_point_id),
    selector: () => session.points.selector,
  },
  priority: {
    type: 'selector',
    title: 'Приоритет',
    apply: (general, data) => general(data.priority),
    selector: () => session.eventTypes.selector,
  },
  company_id: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.company_id),
    selector: () => session.companies.selector,
  },
});

class Events extends Table {
  chart = null;

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(declareColumns(), getEvents(session), filters);
  }

  toString() {
    return 'Events';
  }
}

export default Events;