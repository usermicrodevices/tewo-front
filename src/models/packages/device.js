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

  get salePointId() { return this.device.salePointId; }

  get companyName() { return this.device.companyName; }

  @computed get isDetailsLoaded() {
    return typeof this.detailsRows !== 'undefined';
  }

  @computed get packetsCount() {
    const { detailsRows } = this;
    if (!Array.isArray(detailsRows)) {
      return undefined;
    }
    return detailsRows.length;
  }

  @computed get isHaveDetails() {
    const { detailsRows } = this;
    return Array.isArray(detailsRows) && detailsRows.length > 0;
  }

  @computed get detailsRows() {
    return this.manager.packets.getByDeviceId(this.id);
  }
}

export default Device;
