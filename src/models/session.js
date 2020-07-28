import getCompanies from 'services/companies';
import getSalePoints from 'services/salePoints';
import { observable, computed } from 'mobx';

class Session {
  @observable companiesCache = getCompanies().then((companies) => { this.companiesCache = companies; return companies; });

  @observable pointsCache = getSalePoints().then((points) => { this.pointsCache = points; return points; });

  @computed get companies() {
    if (Array.isArray(this.companiesCache)) {
      return Promise.resolve(this.companiesCache);
    }
    return this.companiesCache;
  }

  @computed get salePoints() {
    if (Array.isArray(this.pointsCache)) {
      return Promise.resolve(this.pointsCache);
    }
    return this.pointsCache;
  }

  getCompanyById(serchedId) {
    if (!Array.isArray(this.companiesCache)) {
      return null;
    }
    for (const company of this.companiesCache) {
      if (company.id === serchedId) {
        return company;
      }
    }
    return null;
  }
}

export default Session;
