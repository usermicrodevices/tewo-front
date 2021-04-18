/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';
import { when } from 'mobx';

import {
  devices as devicesRout,
  salePoints as salePointsRout,
  deviceUpdate as deviceUpdateRout,
} from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';

import { DECLARE_DEVICE_FILTERS } from 'models/devices';
import { getDevices } from 'services/packages';
import Packages from 'components/packages/subtable';

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
    isVisibleByDefault: true,
    title: 'Пакеты',
    sortDirections: 'both',
    grow: 3,
    defaultSortOrder: 'ascend',
  },
};

class Devices extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session, manager) {
    const filter = new Filter(DECLARE_DEVICE_FILTERS(session));
    super(COLUMNS, getDevices(session, manager), filter);
  }

  toString() {
    return 'devicesUpdate';
  }

  get(deviceId) {
    return this.rawData.find(({ id }) => deviceId === id);
  }

  actions = {
    isVisible: true,
    detailsWidget: Packages,
  };
}

export default Devices;
