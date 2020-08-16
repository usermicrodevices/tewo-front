import { observable } from 'mobx';

import getLocations from 'services/locations';
import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';

class Session {
  @observable companiesModel = new Companies();

  @observable pointsModel = new Points(this);

  @observable locationsCache = getLocations().then((towns) => { this.townsCache = towns; return towns; });

  beverages = new Beverages();

  getCompanyById(serchedId) {
    if (!this.companiesModel.isLoaded) {
      return undefined;
    }
    for (const company of this.companiesModel.data) {
      if (company.id === serchedId) {
        return company;
      }
    }
    return null;
  }
}

export default Session;
