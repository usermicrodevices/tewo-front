import { computed } from 'mobx';

class Device {
  id;

  name;

  controller;

  createdDate;

  setupDate;

  salePointId;

  serial;

  deviceModelId;

  priceGroupId;

  session;

  constructor(session) {
    this.session = session;
  }

  @computed get salePoint() {
    const { salePointId } = this;
    if (typeof salePointId !== 'number') {
      return salePointId;
    }
    return this.session.points.get(salePointId);
  }

  @computed get priceGroup() {
    const { priceGroupId } = this;
    if (typeof priceGroupId !== 'number') {
      return priceGroupId;
    }
    return this.session.priceGroups.get(priceGroupId);
  }

  @computed get company() {
    const { salePoint } = this;
    if (!salePoint) {
      return undefined;
    }
    return salePoint.company;
  }

  @computed get companyId() {
    const { salePoint } = this;
    if (!salePoint) {
      return undefined;
    }
    return salePoint.companyId;
  }

  @computed get salePointName() {
    const { salePoint } = this;
    if (!salePoint) {
      return salePoint;
    }
    return salePoint.name;
  }

  @computed get priceGroupName() {
    const { priceGroup } = this;
    if (!priceGroup) {
      return priceGroup;
    }
    return priceGroup.name;
  }
}

export default Device;
