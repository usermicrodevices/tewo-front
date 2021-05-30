/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';

import {
  deviceUpdate as deviceUpdateRout,
} from 'routes';
import { tableItemLink, popoverCell } from 'elements/table/trickyCells';
import { getSessions } from 'services/packages';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
  },
  packetName: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название пакета',
    grow: 3,
    sortDirections: 'both',
    transform: (_, datum, width) => tableItemLink(datum.packetName, `${deviceUpdateRout.path[1]}/${datum.id}`, width),
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
    transform: (_, datum, width) => popoverCell(datum.packetTypeName, datum.packetDescription, width),
  },
  statusName: {
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

const declareFilters = (session, manager) => ({
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
  packet: {
    type: 'selector',
    title: 'Пакет',
    apply: (general, data) => general(data.packetId),
    selector: () => manager.packets.selector,
  },
});

class Sessions extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session, manager) {
    const filter = new Filter(declareFilters(session, manager));
    filter.isShowSearch = false;
    super(COLUMNS, getSessions(session, manager), filter);
  }

  toString() {
    return 'deviceSessions';
  }

  getByDeviceId(deviceId) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ devicesId }) => devicesId.has(deviceId)) || null;
  }

  getByPacketId(packetIdForSearch) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.find(({ packetId }) => packetId === packetIdForSearch) || null;
  }

  get(sessionId) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.find(({ id }) => sessionId === id) || null;
  }
}

export default Sessions;
