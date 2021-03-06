/* eslint class-methods-use-this: off */
import { action, computed, observable } from 'mobx';

import Table from 'models/table';
import Filter from 'models/filters';
import { getPriceGroups, applyPriceGroup, synchronizePriceGroup } from 'services/price';

import { priceList as priceListRout } from 'routes';
import { devicesCell, tableItemLink } from 'elements/table/trickyCells';
import Group from './group';

const COLUMNS = {
  name: {
    isVisibleByDefault: true,
    title: 'Название группы',
    grow: 2,
    sortDirections: 'both',
    transform: (name, { id }, width) => tableItemLink(name, `${priceListRout.path}/${id}`, width),
  },
  devices: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Кофемашины',
    grow: 3,
    sortDirections: 'both',
    transform: devicesCell,
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
  },
};

const declareFilters = (session) => ({
  company_id: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  device_model: {
    type: 'selector',
    title: 'Устройство',
    apply: (general, data) => {
      for (const id of data.devicesIdSet.values()) {
        if (general(id)) {
          return true;
        }
      }
      return false;
    },
    selector: () => session.devices.selector,
  },
});

class PriceGroups extends Table {
  session;

  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  constructor(session) {
    super(COLUMNS, getPriceGroups(session), new Filter(declareFilters(session)));
    this.session = session;
  }

  toString() {
    return 'priceGroup';
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  get(priceId) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.find(({ id }) => id === priceId);
  }

  getPathForPriceGroup(id) {
    return `${priceListRout.path}/${id}`;
  }

  getBySalePoint(pointId) {
    if (!this.isLoaded) {
      return undefined;
    }
    const result = [];
    for (const group of this.rawData) {
      const { devices } = group;
      if (typeof devices === 'undefined') {
        return undefined;
      }
      if (typeof devices.find(({ salePointId }) => salePointId === pointId) !== 'undefined') {
        result.push(group);
      }
    }
    return result;
  }

  @action create() {
    const itm = new Group(this.session);
    this.elementForEdit = itm;
    itm.onCreated = () => {
      this.rawData.push(itm);
    };
  }

  update = applyPriceGroup;

  synchronize = synchronizePriceGroup;
}

export default PriceGroups;
