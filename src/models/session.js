import { observable, computed } from 'mobx';

import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';
import Locations from './locations';

class Session {
  @observable companiesModel = new Companies(this);

  @observable pointsModel = new Points(this);

  @observable locations = new Locations(this);

  beverages = new Beverages();
}

export default Session;
