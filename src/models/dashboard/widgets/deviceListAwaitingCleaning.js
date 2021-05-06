import { computed, observable, reaction } from 'mobx';

class DeviceListOff {
  session;

  generic;

  @observable data;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    this.update();
  }

  @computed get isLoaded() {
    return typeof this.data !== 'undefined';
  }

  @computed get rows() {
    const pointsSet = this.generic.salePointsId === null ? { has: () => true } : new Set(this.generic.salePointsId);
    return this.data.filter(({ id }) => pointsSet.has(id)).map(({ id, beverages }) => {
      const device = this.session.devices.get(id);
      return {
        name: device?.name,
        salePointName: device?.salePointName,
        beverages,
        key: id,
      };
    });
  }

  update = async () => {
    this.data = await this.session.devices.getUncleaned();
  };
}

export default DeviceListOff;
