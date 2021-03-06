import { computed } from 'mobx';

import { SemanticRanges } from 'utils/date';

class Settings {
  settings;

  session;

  @computed get salePoints() {
    const salePontsFilter = this.settings.get('salePontsFilter');
    const companiesFilter = this.settings.get('companiesFilter');
    if (!Array.isArray(salePontsFilter) || salePontsFilter.length === 0) {
      if (!Array.isArray(companiesFilter) || companiesFilter.length === 0) {
        return null;
      }
      if (!this.session.points.isLoaded) {
        return undefined;
      }
      return this.session.points.getByCompanyIdSet(new Set(companiesFilter));
    }
    if (!this.session.points.isLoaded) {
      return undefined;
    }
    return this.session.points.getSubset(new Set(salePontsFilter));
  }

  @computed get isHaveExplicitCompaniesFilter() {
    const salePontsFilter = this.settings.get('salePontsFilter');
    return Array.isArray(salePontsFilter) && salePontsFilter.length > 0;
  }

  @computed get companies() {
    const companiesFilter = this.settings.get('companiesFilter');
    if (!Array.isArray(companiesFilter) || companiesFilter.length === 0) {
      return null;
    }
    return this.session.companies.getSubset(new Set(companiesFilter));
  }

  @computed get salePointsId() {
    const salePontsFilter = this.settings.get('salePontsFilter');
    const companiesFilter = this.settings.get('companiesFilter');
    if (!Array.isArray(salePontsFilter) || salePontsFilter.length === 0) {
      if (!Array.isArray(companiesFilter) || companiesFilter.length === 0) {
        return null;
      }
      if (!this.session.points.isLoaded) {
        return undefined;
      }
      return this.session.points.getByCompanyIdSet(new Set(companiesFilter)).map(({ id }) => id);
    }
    return salePontsFilter;
  }

  set dateRangeKey(key) {
    if (key in SemanticRanges) {
      this.settings.set('dateFilter', key);
    }
  }

  @computed get widgetType() {
    return this.settings.get('widgetType');
  }

  @computed get dateRangeName() {
    const dateFilter = this.settings.get('dateFilter');
    if (dateFilter in SemanticRanges) {
      return SemanticRanges[dateFilter].title;
    }
    return '???? ?????? ??????????';
  }

  @computed get dateRange() {
    const dateFilter = this.settings.get('dateFilter');
    if (dateFilter in SemanticRanges) {
      return SemanticRanges[dateFilter].resolver();
    }
    return null;
  }

  @computed get devices() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    if (this.salePointsId === null) {
      return this.session.devices.rawData;
    }
    return this.session.devices.getPointsSetDevices(new Set(this.salePointsId));
  }

  getPointsFilter(field) {
    const { salePointsId } = this;
    if (typeof salePointsId === 'undefined') {
      return undefined;
    }
    if (Array.isArray(salePointsId)) {
      if (salePointsId.length === 1) {
        return `${field}=${salePointsId[0]}`;
      }
      return `${field}__in=${salePointsId}`;
    }
    return '';
  }

  constructor(settings, session) {
    this.settings = settings;
    this.session = session;
  }
}

export default Settings;
