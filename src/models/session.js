import { observable } from 'mobx';

import getLocations from 'services/locations';
import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';

class Session {
  @observable companiesModel = new Companies();

  @observable pointsModel = new Points(this);

  @observable locationsCache = getLocations().then((towns) => { this.townsCache = towns; return towns; });

  @observable beverageModel = new Beverages();

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

  destruct() {
    this.companiesModel.destruct();
    this.pointsModel.destruct();
    this.beverageModel.destruct();
  }
}

export default Session;
