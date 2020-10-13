import { computed } from 'mobx';

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

class Map {
  session;

  filters;

  constructor(session) {
    this.session = session;
    this.filters = new Filters(declareFilters(session));
  }

  @computed({ keepAlive: true }) get isLoaded() {
    return this.session.points.isLoaded;
  }

  @computed({ keepAlive: true }) get points() {
    const { points } = this.session;
    const locations = points.rawData.filter(this.filters.predicate).filter(({ mapPoint }) => mapPoint !== null).map(({ location, id }) => ({ location, id }));

    return locations;
  }
}

export default Map;
