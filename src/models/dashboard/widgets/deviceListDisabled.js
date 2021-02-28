import { computed, observable, reaction } from 'mobx';

class DeviceListDisabled {
  session;

  generic;

  @observable data;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    reaction(() => [this.generic.salePointsId, this.generic.dateRange], () => {
      this.data = undefined;
      this.update();
    });
    this.update();
  }

  @computed get isLoaded() {
    return typeof this.data !== 'undefined';
  }

  @computed get rows() {
    return this.data.map(({ id, unused }) => {
      const device = this.session.devices.get(id);
      return {
        name: device?.name,
        salePointName: device?.salePointName,
        unused,
        key: id,
      };
    });
  }

  update = async () => {
    this.data = await this.session.devices.getDisabled();
  };
}

export default DeviceListDisabled;
