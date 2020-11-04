import { computed } from 'mobx';

class DiagramTechState {
  generic;

  session;

  @computed get devicesAmount() {
    if (!Array.isArray(this.generic.devices)) {
      return undefined;
    }
    return this.generic.devices.length;
  }

  @computed get offDevicesAmount() {
    if (!Array.isArray(this.generic.devices)) {
      return undefined;
    }
    return this.generic.devices.filter(({ isOn }) => !isOn).length;
  }

  @computed get devicesServceRequiredAmount() {
    if (!Array.isArray(this.generic.devices)) {
      return undefined;
    }
    return this.generic.devices.filter(({ isNeedTechService }) => isNeedTechService).length;
  }

  @computed get devicesHardWaterAmount() {
    if (!Array.isArray(this.generic.devices)) {
      return undefined;
    }
    const { devices } = this.generic;
    if (devices.find(({ isHasOverlocPPM }) => typeof isHasOverlocPPM === 'undefined')) {
      return undefined;
    }
    return devices.filter(({ isHasOverlocPPM }) => isHasOverlocPPM).length;
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;
  }
}

export default DiagramTechState;
