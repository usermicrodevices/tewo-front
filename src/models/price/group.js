import { computed } from 'mobx';

class PriceGroup {
  name;

  companyId;

  conception;

  systemKey;

  devicesIdSet;

  pricesIdSet;

  id;

  session;

  constructor(session) {
    this.session = session;
  }

  @computed get devices() {
    return this.session.devices.getBySet(this.devicesIdSet);
  }

  @computed get company() {
    return this.session.companies.get(this.companyId);
  }

  @computed get companyName() {
    return this.company?.name;
  }

  @computed get prices() {
    return this.session.prices.getBySet(this.pricesIdSet);
  }

  @computed get drinks() {
    return this.prices?.map((price) => price.drink);
  }

  @computed get drinksCount() {
    return this.pricesIdSet.size;
  }
}

export default PriceGroup;
