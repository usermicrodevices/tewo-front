/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';

import packetPopover from 'components/packages/packetPopover';
import {
  devices as devicesRout,
  salePoints as salePointsRout,
  deviceUpdate as deviceUpdateRout,
} from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';

import { DECLARE_DEVICE_FILTERS } from 'models/devices';
import { getDevices } from 'services/packages';

const COLUMNS = {
  serial: {
    isVisibleByDefault: true,
    title: 'Серийный номер',
    grow: 3,
    sortDirections: 'both',
    transform: (_, datum, width) => tableItemLink(datum.serial, `${deviceUpdateRout.path}/${datum.id}`, width),
  },
  name: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
    transform: (_, datum, width) => tableItemLink(datum.name, `${devicesRout.path}/${datum.id}`, width),
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    grow: 3,
    transform: (_, datum, width) => tableItemLink(datum.salePointName, `${salePointsRout.path}/${datum.salePointId}`, width),
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
  },
  packetsCount: {
    isVisibleByDefault: false,
    title: 'Пакеты',
    sortDirections: 'both',
    grow: 3,
  },
  lastPacket: {
    isVisibleByDefault: true,
    title: 'Последний пакет',
    grow: 3,
    transform: (packet) => packetPopover(packet),
  },
};

class Devices extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session, manager) {
    const filter = new Filter({
      ...DECLARE_DEVICE_FILTERS(session),
      isHaveLoadedPackets: {
        type: 'checkbox',
        title: 'Только устройства, на котрые загружались пакеты',
        apply: (_, data) => Boolean(data.lastPacketId),
        passiveValue: false,
        initialValue: true,
      },
    });
    super(COLUMNS, getDevices(session, manager), filter);
  }

  toString() {
    return 'devicesUpdate';
  }

  get(deviceId) {
    return this.rawData.find(({ id }) => deviceId === id);
  }
}

export default Devices;
