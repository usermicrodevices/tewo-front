/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';

import { devices as devicesRout, salePoints as salePointsRout } from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';

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
    transform: (_, datum, width) => tableItemLink(datum.name, `${devicesRout.path}/${datum.id}`, width),
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Версия пакета',
    grow: 3,
    transform: (_, datum, width) => tableItemLink(datum.salePointName, `${salePointsRout.path}/${datum.salePointId}`, width),
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Тип пакета',
    grow: 2,
    sortDirections: 'both',
  },
  controller: {
    isVisibleByDefault: true,
    title: 'Статус',
    grow: 3,
    sortDirections: 'both',
  },
  serial: {
    isVisibleByDefault: false,
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

class Packages extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session) {
    const filter = new Filter(declareFilters(session));
    super(COLUMNS, () => Promise.resolve({ count: 0, results: [] }), filter);
  }

  toString() {
    return 'devicePackages';
  }
}

export default Packages;
