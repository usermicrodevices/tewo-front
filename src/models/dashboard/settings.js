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

  @computed get dateRange() {
    const dateFilter = this.settings.get('dateFilter');
    if (dateFilter in SemanticRanges) {
      return SemanticRanges[dateFilter].resolver();
    }
    return null;
  }

  constructor(settings, session) {
    this.settings = settings;
    this.session = session;
  }
}

export default Settings;
