/* eslint class-methods-use-this: "off" */
import Table from 'models/table';
import Filter from 'models/filters';
import { getCosts } from 'services/costs';
import { computed } from 'mobx';

const COLUMNS = {
  name: {
    isVisibleByDefault: true,
    title: 'Название группы',
    grow: 3,
    sortDirections: 'descend',
  },
  deviceNames: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Кофемашины',
    grow: 3,
    sortDirections: 'both',
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 3,
    sortDirections: 'both',
  },
};

const declareFilters = (session) => ({
});

class Costs extends Table {
  get isImpossibleToBeAsync() { return true; }

  constructor(session) {
    super(COLUMNS, getCosts(session), new Filter(declareFilters(session)));
  }

  toString() {
    return 'costs';
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  get(deviceId) {
    return this.rawData.find(({ id }) => id === deviceId);
  }
}

export default Costs;
