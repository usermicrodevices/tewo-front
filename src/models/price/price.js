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

  @computed get company() {
    const { drink } = this;
    return drink && drink.company;
  }

  @computed get companyName() {
    const { company } = this;
    return company && company.name;
  }

  @computed get devices() {
    return [];
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
