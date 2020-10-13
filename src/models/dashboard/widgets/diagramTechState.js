import { computed } from 'mobx';

class Chart {
  generic;

  session;

  @computed get devices() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    return this.session.devices.getPointsSetDevices(new Set(this.generic.salePointsId));
  }

  @computed get devicesAmount() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    return this.defices.length;
  }

  @computed get offDevicesAmount() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    return this.devices.filter(({ isOn }) => !isOn);
  }

  @computed get devicesServceRequiredAmount() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    return this.devices.filter(({ isNeedTechService }) => !isNeedTechService).length;
  }

  @computed get devicesHardWaterAmount() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    return this.devices.filter(({ isHasOverlocPPM }) => !isHasOverlocPPM).length;
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;
  }
}

export default Chart;
