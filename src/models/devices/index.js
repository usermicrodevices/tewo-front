/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';
import { computed } from 'mobx';

import { devices as devicesRout, salePoints as salePointsRout } from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';
import {
  getDevices, getStats, getSalesChart, applyDevice, getVoltage, getWaterQuality, getQR,
} from 'services/device';

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
  controller: {
    isVisibleByDefault: true,
    title: 'ID контроллера',
    grow: 3,
    sortDirections: 'both',
  },
  serial: {
    isVisibleByDefault: false,
    title: 'Серийный номер',
    grow: 3,
    sortDirections: 'both',
  },
  timeZone: {
    isVisibleByDefault: false,
    title: 'Временная зона',
    grow: 3,
    sortDirections: 'both',
  },
  mileage: {
    isVisibleByDefault: true,
    title: 'Пробег',
    grow: 3,
    sortDirections: 'both',
  },
  deviceModelType: {
    isVisibleByDefault: false,
    title: 'Тип оборудования',
    grow: 3,
    sortDirections: 'both',
  },
  deviceModelName: {
    isVisibleByDefault: true,
    title: 'Модель оборудования',
    grow: 3,
    sortDirections: 'both',
  },
  priceGroupName: {
    isVisibleByDefault: true,
    title: 'Группа цен',
    grow: 3,
    sortDirections: 'both',
  },
  setupDate: {
    isVisibleByDefault: false,
    title: 'Дата монтажа',
    width: 189,
    sortDirections: 'both',
  },
};

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  salePointId: {
    type: 'selector',
    title: 'Объект',
    apply: (general, data) => general(data.salePointId),
    selector: () => session.points.selector,
  },
  deviceModelType: {
    type: 'selector',
    title: 'Тип оборудования',
    apply: (general, data) => general(data.deviceModelId),
    selector: () => [],
    disabled: true,
  },
  deviceModelName: {
    type: 'selector',
    title: 'Модель оборудования',
    apply: (general, data) => general(data.deviceModelId),
    selector: () => session.deviceModels.selector,
  },
  serial: {
    type: 'text',
    title: 'Серийный номер',
    apply: (general, { serial }) => serial !== null && general(serial),
  },
  setupDate: {
    type: 'daterange',
    title: 'Дата монтажа',
    apply: (general, data) => general(data.setupDate),
  },
  isNeedTechService: {
    type: 'checkbox',
    title: 'Требуется тех. обслуживание',
    apply: (_, data) => data.isNeedTechService,
    passiveValue: false,
  },
  isOn: {
    type: 'checkbox',
    title: 'Только включенное оборудование',
    apply: (_, data) => data.isOn !== false,
    passiveValue: false,
  },
});

class Devices extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session) {
    const filter = new Filter(declareFilters(session));
    super(COLUMNS, getDevices(session), filter);
  }

  toString() {
    return 'devices';
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  salePointsSelector(points) {
    const pointsSet = new Set(points);
    return this.rawData
      .filter(pointsSet.size === 0 ? () => true : ({ salePointId }) => pointsSet.has(salePointId))
      .map(({ id, name }) => [id, name]);
  }

  get(deviceId) {
    return this.rawData.find(({ id }) => id === deviceId);
  }

  getByPriceGroupId(groupId) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ priceGroupId }) => priceGroupId === groupId);
  }

  getBySet(ids) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ id }) => ids.has(id));
  }

  getPointsSetDevices(pointsSet) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ salePointId, isInactive }) => pointsSet.has(salePointId) && !isInactive);
  }

  getPointDevices(pointId) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ salePointId, isInactive }) => pointId === salePointId && !isInactive);
  }

  count(predicate) {
    return this.rawData.filter(predicate).length;
  }

  getQR = getQR;

  getVoltage = getVoltage;

  getWaterQuality = getWaterQuality;

  getStats = getStats;

  getSalesChart = getSalesChart;

  applyDevice = applyDevice;
}

export { Devices as default, declareFilters as DECLARE_DEVICE_FILTERS };
