/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import Filter from 'models/filters';
import { getDevices } from 'services//device';
import { computed } from 'mobx';

const COLUMNS = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
  },
  name: {
    isDefaultSort: true,
    isVisbleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
  },
  salePointName: {
    isVisbleByDefault: true,
    title: 'Объект',
    grow: 3,
    sortDirections: 'both',
  },
  controller: {
    isVisbleByDefault: true,
    title: 'ID контроллера',
    grow: 3,
    sortDirections: 'both',
  },
  serial: {
    isVisbleByDefault: true,
    title: 'Серийный номер',
    grow: 3,
    sortDirections: 'both',
  },
  timeZone: {
    isVisbleByDefault: true,
    title: 'Временная зона',
    grow: 3,
    sortDirections: 'both',
  },
  deviceModelType: {
    isVisbleByDefault: true,
    title: 'Тип оборудования',
    grow: 3,
    sortDirections: 'both',
  },
  deviceModelName: {
    isVisbleByDefault: true,
    title: 'Модель оборудования',
    grow: 3,
    sortDirections: 'both',
  },
  priceGroupName: {
    isVisbleByDefault: true,
    title: 'Группа цен',
    grow: 3,
    sortDirections: 'both',
  },
  setupDate: {
    isVisbleByDefault: true,
    title: 'Дата монтажа',
    grow: 3,
    sortDirections: 'both',
    transform: (data) => data.format('D MMMM YYYY'),
  },
};

const declareFilters = (session) => ({
  start_date: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.startDate),
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
    selector: () => [],
    disabled: true,
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
  isNeedOverhaul: {
    type: 'checkbox',
    title: 'Требуется тех. обслуживание',
    apply: (_, data) => data.isNeedOverhaul,
    passiveValue: false,
    disabled: true,
  },
  isHaveDisabledEquipment: {
    type: 'checkbox',
    title: 'С выключенным оборудованием',
    apply: (_, data) => data.isHaveDisabledEquipment,
    passiveValue: false,
    disabled: true,
  },
});

class Devices extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session) {
    super(COLUMNS, getDevices(session), new Filter(declareFilters(session)));
  }

  toString() {
    return 'devices';
  }

  @computed get selector() {
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  salePointsSelector(points) {
    const pointsSet = new Set(points);
    return this.rawData
      .filter(({ salePointId }) => pointsSet.has(salePointId))
      .map(({ id, name }) => [id, name]);
  }

  get(deviceId) {
    return this.rawData.find(({ id }) => id === deviceId);
  }
}

export default Devices;
