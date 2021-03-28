class Device {
  device;

  session;

  constructor(session, coreDevice) {
    this.device = coreDevice;
    this.session = session;
  }

  get id() { return this.device.id; }

  get serial() { return this.device.serial; }

  get name() { return this.device.name; }

  get salePointName() { return this.device.salePointName; }

  get companyName() { return this.device.companyName; }

  get packages() { return undefined; }
}

export default Device;
