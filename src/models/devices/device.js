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

  timeZone;

  session;

  isOn;

  isInactive;

  downtime;

  isHasOverlocPPM;

  isNeedTechService;

  isHaveOverdueTasks;

  stopDate;

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

  @computed get deviceModelName() {
    if (typeof this.deviceModelId !== 'number') {
      return this.deviceModelId;
    }
    const deviceModel = this.session.deviceModels.get(this.deviceModelId);
    return deviceModel ? deviceModel.name : deviceModel;
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

  @computed get salePointLocation() {
    const { salePoint } = this;
    if (!salePoint) {
      return salePoint;
    }
    return salePoint.location;
  }

  @computed get salePointAddress() {
    const { salePoint } = this;
    if (!salePoint) {
      return salePoint;
    }
    return salePoint.address;
  }

  @computed get priceGroupName() {
    const { priceGroup } = this;
    if (!priceGroup) {
      return priceGroup;
    }
    return priceGroup.name;
  }

  editable = {
    name: {
      type: 'text',
    },
  }

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
    ];
  }
}

export default Device;
