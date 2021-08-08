/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';

import {
  deviceUpdate as deviceUpdateRout,
} from 'routes';
import { devicesCell, tableItemLink, popoverCell } from 'elements/table/trickyCells';
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
  devicesList: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Кофемашины',
    grow: 3,
    sortDirections: 'both',
    transform: devicesCell,
  },
  created: {
    isVisibleByDefault: true,
    title: 'Дата создания',
    grow: 3,
    sortDirections: 'both',
  },
};

const anyOfArray = (elements, filter) => {
  for (const e of elements) {
    if (filter(e)) {
      return true;
    }
  }
  return false;
};

const declareFilters = (session, manager) => ({
  devices: {
    type: 'selector',
    title: 'Оборудование',
    apply: (general, data) => anyOfArray(data.devices.map(({ deviceId }) => deviceId), general),
    selector: ({ data }) => {
      const models = new Set(data.get('devicesModel'));
      if (models.size) {
        return session.devices.rawData
          .filter(({ deviceModelId }) => models.has(deviceModelId))
          .map(({ id, name }) => [id, name]);
      }
      return session.devices.selector;
    },
  },
  created: {
    type: 'daterange',
    title: 'Дата создания',
    apply: (general, data) => general(data.created),
  },
  devicesModel: {
    type: 'selector',
    title: 'Модель оборудования',
    apply: (general, data) => anyOfArray(data.devicesList.map(({ deviceModelId }) => deviceModelId).filter(Boolean), general),
    selector: (filter) => session.deviceModels.selector,
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
