/* eslint class-methods-use-this: off */
import Table from 'models/table';
import Filter from 'models/filters';
import { getPriceGroups } from 'services/price';
import { computed } from 'mobx';

import { priceList as priceListRout } from 'routes';
import { devicesCell, tableItemLink } from 'elements/table/trickyCells';

const COLUMNS = {
  name: {
    isVisibleByDefault: true,
    title: 'Название группы',
    grow: 2,
    sortDirections: 'descend',
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
    apply: (general, data) => general(data.deviceModelId),
    selector: () => session.devices.selector,
  },
});

class PriceGroups extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session) {
    super(COLUMNS, getPriceGroups(session), new Filter(declareFilters(session)));
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
    return this.rawData.find(({ id }) => id === priceId);
  }
}

export default PriceGroups;
