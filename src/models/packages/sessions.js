/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';

import {
  deviceUpdate as deviceUpdateRout,
} from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';
import { getSessions } from 'services/packages';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
  },
  name: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название пакета',
    grow: 3,
    sortDirections: 'both',
    transform: (_, datum, width) => tableItemLink(datum.name, `${deviceUpdateRout.path}/${datum.id}`, width),
  },
  version: {
    isVisibleByDefault: true,
    title: 'Версия пакета',
    grow: 3,
  },
  packetTypeName: {
    isVisibleByDefault: true,
    title: 'Тип пакета',
    grow: 2,
    sortDirections: 'both',
  },
  status: {
    isVisibleByDefault: true,
    title: 'Статус',
    grow: 3,
    sortDirections: 'both',
  },
  created: {
    isVisibleByDefault: true,
    title: 'Дата создания',
    grow: 3,
    sortDirections: 'both',
  },
};

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Оборудование',
    apply: (general, data) => general(data.deviceId),
    selector: () => session.devices.selector,
  },
  salePointId: {
    type: 'selector',
    title: 'Дата создания',
    apply: (general, data) => general(data.salePointId),
    selector: () => session.points.selector,
  },
  deviceModelName: {
    type: 'selector',
    title: 'Модель оборудования',
    apply: (general, data) => general(data.deviceModelId),
    selector: () => session.deviceModels.selector,
  },
});

class Sessions extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session, manager) {
    const filter = new Filter(declareFilters(session));
    super(COLUMNS, getSessions(session, manager), filter);
  }

  toString() {
    return 'deviceSessions';
  }

  getByDeviceId(deviceId) {
    return this.rawData.filter(({ devicesId }) => devicesId.has(deviceId));
  }

  getByPacketId(packetIdForSearch) {
    return this.rawData.filter(({ packetId }) => packetId === packetIdForSearch);
  }

  get(sessionId) {
    return this.rawData.find(({ id }) => sessionId === id);
  }
}

export default Sessions;
