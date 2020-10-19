import { computed, observable, action } from 'mobx';

import Filters from './filters';

const declareFilters = (session) => ({
  companyId: {
    type: 'singleselector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
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

const getStateForSalepoint = (salePoint) => {
  if (salePoint.isClosed) {
    return 4;
  }

  if (salePoint.isHaveDisabledEquipment) {
    return 3;
  }

  if (salePoint.isNeedTechService || salePoint.isHasOverlocPPM || salePoint.isHaveOverdueTasks) {
    return 2;
  }

  return 1;
};

class Map {
  session;

  filters;

  @observable selectedPoint = null;

  @observable isInfoModalShown = false;

  constructor(session) {
    this.session = session;
    this.filters = new Filters(declareFilters(session));
  }

  @action showPointInfo(id) {
    this.selectedPoint = this.session.points.get(id);
    this.isInfoModalShown = true;
  }

  @action hidePointInfo(id) {
    this.isInfoModalShown = false;
  }

  @computed({ keepAlive: true }) get selectedPointDevices() {
    return this.selectedPoint ? this.selectedPoint.devices : [];
  }

  @computed({ keepAlive: true }) get isLoaded() {
    return this.session.points.isLoaded;
  }

  @computed({ keepAlive: true }) get points() {
    const { points } = this.session;
    const locations = points.rawData
      .filter(this.filters.predicate)
      .filter(({ mapPoint }) => mapPoint !== null)
      .map((salePoint) => ({
        id: salePoint.id,
        name: salePoint.name,
        values: salePoint.values,
        location: salePoint.location,
        state: getStateForSalepoint(salePoint),
      }));

    return locations;
  }
}

export default Map;
