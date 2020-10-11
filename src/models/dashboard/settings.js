import { computed } from 'mobx';

import { SemanticRanges } from 'utils/date';

class Settings {
  settings;

  session;

  @computed get salePoints() {
    const { salePontsFilter, companiesFilter } = this.settings;
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

  @computed get salePointIds() {
    const { salePontsFilter, companiesFilter } = this.settings;
    if (!Array.isArray(salePontsFilter) || salePontsFilter.length === 0) {
      if (!Array.isArray(companiesFilter) || companiesFilter.length === 0) {
        return null;
      }
      if (!this.session.companies.isLoaded) {
        return undefined;
      }
      return this.session.companies.getByCompanyIdSet(new Set(companiesFilter)).map(({ id }) => id);
    }
    return salePontsFilter;
  }

  @computed get dateRange() {
    const { dateFilter } = this.settings;
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
