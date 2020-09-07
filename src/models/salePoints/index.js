/* eslint class-methods-use-this: "off" */
import { observable, computed, action } from 'mobx';

import Table from 'models/table';
import getSalePoints from 'services/salePoints';
import Filters from 'models/filters';

import Point from './salePoint';

const COLUMNS = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
    isAsyncorder: true,
  },
  name: {
    isDefaultSort: true,
    isVisbleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
  },
  companyName: {
    isVisbleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
  },
  tags: {
    isVisbleByDefault: false,
    title: 'Теги',
    grow: 2,
  },
  regionName: {
    isVisbleByDefault: false,
    title: 'Регоин',
    grow: 2,
  },
  cityName: {
    isVisbleByDefault: false,
    title: 'Город',
    grow: 2,
    sortDirections: 'both',
  },
  address: {
    isVisbleByDefault: true,
    title: 'Адрес',
    grow: 4,
    sortDirections: 'descend',
  },
  person: {
    isVisbleByDefault: false,
    title: 'Ответственный',
    grow: 2,
  },
  phone: {
    isVisbleByDefault: true,
    title: 'Телефон',
    grow: 2,
  },
  email: {
    isVisbleByDefault: true,
    title: 'Email',
    grow: 2,
  },
  overdueTasks: {
    isVisbleByDefault: true,
    title: 'Количество просроченных задач',
    grow: 2,
  },
  downTime: {
    isVisbleByDefault: true,
    title: 'Суммарный простой',
    grow: 2,
  },
};

const declareFilters = (session) => ({
  companyId: {
    type: 'singleselector',
    title: 'Компания',
    apply: (general, data) => general(data.sale_sum),
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
  isHaveOutdatedEvents: {
    type: 'checkbox',
    title: 'С просроченными событиями',
    apply: (general, data) => data.isHaveOutdatedEvents,
    passiveValue: false,
  },
  isNeedOverhaul: {
    type: 'checkbox',
    title: 'Требуется тех. обслуживание',
    apply: (general, data) => data.isNeedOverhaul,
    passiveValue: false,
  },
  isHaveDisabledEquipment: {
    type: 'checkbox',
    title: 'С выключенным оборудованием',
    apply: (general, data) => data.isHaveDisabledEquipment,
    passiveValue: false,
  },
  isOutOfWaterQuality: {
    type: 'checkbox',
    title: 'На оборудовании превышена жесткость воды',
    apply: (general, data) => data.isOutOfWaterQuality,
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
}

export default SalePoints;
