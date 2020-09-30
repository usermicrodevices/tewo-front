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
    return this.drinkId && this.session.drinks.get(this.drinkId);
  }

  @computed get group() {
    return this.groupId && this.session.priceGroups.get(this.groupId);
  }

  @computed get groupName() {
    const { group } = this;
    return group && group.name;
  }
}

export default Price;
