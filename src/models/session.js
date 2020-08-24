import { observable, computed } from 'mobx';

import getLocations from 'services/locations';
import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';

class Session {
  @observable companiesModel = new Companies(this);

  @observable pointsModel = new Points(this);

  @observable locationsCache = getLocations().then((towns) => { this.locationsCache = towns; return towns; });

  beverages = new Beverages();

  @computed get cities() {
    if (this.locationsCache instanceof Promise) {
      return [];
    }
    return [...this.locationsCache.cities.entries()];
  }
}

export default Session;
