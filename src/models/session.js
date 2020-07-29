import { observable, computed } from 'mobx';

import getCompanies from 'services/companies';
import getSalePoints from 'services/salePoints';
import getLocations from 'services/locations';
import Beverages from './beverages';

class Session {
  @observable companiesCache = getCompanies().then((companies) => { this.companiesCache = companies; return companies; });

  @observable pointsCache = getSalePoints().then((points) => { this.pointsCache = points; return points; });

  @observable locationsCache = getLocations().then((towns) => { this.townsCache = towns; return towns; });

  @observable beverageModel = new Beverages();

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
