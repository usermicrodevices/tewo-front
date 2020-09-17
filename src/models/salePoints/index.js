/* eslint class-methods-use-this: off */
import { observable, computed, action } from 'mobx';

import Table from 'models/table';
import {
  getSalePoints, applySalePoint, getSalesTop, getSalesChart, getOutdatedTasks,
} from 'services/salePoints';
import Filters from 'models/filters';

import { salePoints as salePointsRout } from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';

import Point from './salePoint';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
    isAsyncorder: true,
  },
  name: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
    transform: (_, datum, width) => tableItemLink(datum.name, `${salePointsRout.path}/${datum.id}`, width),
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
  },
  tags: {
    isVisibleByDefault: false,
    title: 'Теги',
    grow: 2,
  },
  regionName: {
    isVisibleByDefault: false,
    title: 'Регоин',
    grow: 2,
  },
  cityName: {
    isVisibleByDefault: false,
    title: 'Город',
    grow: 2,
    sortDirections: 'both',
  },
  address: {
    isVisibleByDefault: true,
    title: 'Адрес',
    grow: 4,
    sortDirections: 'descend',
  },
  person: {
    isVisibleByDefault: false,
    title: 'Ответственный',
    grow: 2,
  },
  phone: {
    isVisibleByDefault: true,
    title: 'Телефон',
    grow: 2,
  },
  email: {
    isVisibleByDefault: true,
    title: 'Email',
    grow: 2,
  },
  downtime: {
    isVisibleByDefault: true,
    title: 'Суммарный простой',
    grow: 2,
  },
};

const declareFilters = (session) => ({
  companyId: {
    type: 'singleselector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  tag: {
    type: 'selector',
    title: 'Тег',
    apply: (general, data) => general(data.drink),
    selector: () => [
      [1, 'a'], [2, 'b'],
    ],
    disabled: true,
  },
  regionId: {
    type: 'singleselector',
    title: 'Регион',
    apply: (general, data) => general(data.regionId),
    selector: () => session.locations.regionsSelector,
  },
  cityId: {
    type: 'singleselector',
    title: 'Город',
    apply: (general, data) => general(data.cityId),
    selector: () => session.locations.citiesSelector,
  },
  isHaveOverdueTasks: {
    type: 'checkbox',
    title: 'С просроченными событиями',
    apply: (_, data) => data.isHaveOverdueTasks,
    passiveValue: false,
  },
  isNeedTechService: {
    type: 'checkbox',
    title: 'Требуется тех. обслуживание',
    apply: (_, data) => data.isNeedTechService,
    passiveValue: false,
  },
  isHaveDisabledEquipment: {
    type: 'checkbox',
    title: 'С выключенным оборудованием',
    apply: (_, data) => data.isHaveDisabledEquipment,
    passiveValue: false,
  },
  isHasOverlocPPM: {
    type: 'checkbox',
    title: 'На оборудовании превышена жесткость воды',
    apply: (_, data) => data.isHasOverlocPPM,
    passiveValue: false,
  },
});

class SalePoints extends Table {
  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
  };

  chart = null;

  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  session;

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(COLUMNS, getSalePoints(session), filters);
    this.session = session;
  }

  toString() {
    return 'SalePoints';
  }

  get(pointId) {
    return this.rawData.find(({ id }) => id === pointId);
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  @action create() {
    this.elementForEdit = new Point(this.session);
  }

  getSalesTop = getSalesTop;

  getSalesChart = getSalesChart;

  getOutdatedTasks = getOutdatedTasks;

  get applyer() {
    return (item, changes) => applySalePoint(item, changes).then((response) => ({
      response,
      sorageData: this.rawData,
    }));
  }
}

export default SalePoints;
