import { computed } from 'mobx';

import Datum from 'models/datum';

class Price extends Datum {
  session;

  drinkId;

  groupId;

  value;

  id;

  constructor(session) {
    super(Promise.resolve);

    this.session = session;
  }

  @computed get drink() {
    return this.session.drinks.get(this.drinkId);
  }

  @computed get plu() {
    return this.drink?.plu;
  }

  @computed get name() {
    return this.drink?.name;
  }
}

export default Price;
