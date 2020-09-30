import { computed } from 'mobx';

class PriceGroup {
  name;

  companyId;

  conception;

  systemKey;

  devicesIdSet;

  id;

  session;

  constructor(session) {
    this.session = session;
  }

  @computed get devices() {
    // return this.session.devices.getByPriceGroupId(this.groupId); не работает из-за неконсистентности api
    return this.session.devices.getBySet(this.devicesIdSet);
  }

  @computed get company() {
    return this.session.companies.get(this.companyId);
  }

  @computed get companyName() {
    return this.company?.name;
  }
}

export default PriceGroup;
