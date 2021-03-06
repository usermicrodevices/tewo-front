import { computed } from 'mobx';

class Device {
  device;

  session;

  manager;

  lastPacketId;

  constructor(coreDevice, lastPacketId, session, manager) {
    this.lastPacketId = lastPacketId;
    this.device = coreDevice;
    this.session = session;
    this.manager = manager;
  }

  @computed get lastPacket() {
    if (!this.manager.packets.isLoaded) {
      return undefined;
    }
    return this.manager.packets.get(this.lastPacketId) || null;
  }

  @computed get sessionId() {
    return this.manager.sessions.getByPacketId(this.lastPacketId)?.id;
  }

  get softwareVersion() { return this.device.softwareVersion; }

  get statusId() {
    if (this.device.status === -1) {
      return 3;
    }
    if (this.device.status === 0) {
      return 2;
    }
    if (this.device.isNeedTechService) {
      return 1;
    }
    return 0;
  }

  get badgedName() {
    return {
      stateColor: [
        '#4CD964',
        '#FABC5F',
        '#FF3B30',
        '#9A9A9A',
      ][this.statusId],
      name: this.name,
    };
  }

  get id() { return this.device.id; }

  get serial() { return this.device.serial; }

  get name() { return this.device.name; }

  get salePointName() { return this.device.salePointName; }

  get salePointId() { return this.device.salePointId; }

  get companyName() { return this.device.companyName; }

  get deviceModelType() { return this.device.deviceModelType; }

  get deviceModelId() { return this.device.deviceModelId; }

  get deviceModelName() { return this.device.deviceModelName; }

  get setupDate() { return this.device.setupDate; }

  get isNeedTechService() { return this.device.isNeedTechService; }

  get isOn() { return this.device.isOn; }

  @computed get companyId() { return this.device.companyId; }

  @computed get packetsCount() {
    const { detailsRows } = this;
    if (!Array.isArray(detailsRows)) {
      return undefined;
    }
    return detailsRows.length;
  }
}

export default Device;
