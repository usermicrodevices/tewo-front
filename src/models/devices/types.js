import { getDeviceTypes } from 'services/device';

class DeviceTypes extends Map {
  constructor() {
    super();

    getDeviceTypes(this);
  }

  get selector() {
    return [...this.entries()];
  }
}

export default DeviceTypes;
