import { computed } from 'mobx';

class Device {
  device;

  session;

  manager;

  constructor(coreDevice, session, manager) {
    this.device = coreDevice;
    this.session = session;
    this.manager = manager;
  }

  get id() { return this.device.id; }

  get serial() { return this.device.serial; }

  get name() { return this.device.name; }

  get salePointName() { return this.device.salePointName; }

  get companyName() { return this.device.companyName; }

  @computed get isDetailsLoaded() {
    return typeof this.detailsRows !== 'undefined';
  }

  @computed get packetsCount() {
    return `${this.detailsRows.length}`;
  }

  @computed get detailsRows() {
    if (typeof this.manager.packets.getByDeviceId !== 'function') {
      return [];
    }
    return this.manager.packets.getByDeviceId(this.id) || [];
  }
}

export default Device;
