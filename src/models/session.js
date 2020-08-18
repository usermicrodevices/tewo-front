import { observable } from 'mobx';

import getLocations from 'services/locations';
import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';

class Session {
  @observable companiesModel = new Companies(this);

  @observable pointsModel = new Points(this);

  @observable locationsCache = getLocations().then((towns) => { this.locationsCache = towns; return towns; });

  beverages = new Beverages();
}

export default Session;
