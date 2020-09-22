import { getDeviceModels } from 'services/device';

class DeviceModels extends Map {
  constructor() {
    super();

    getDeviceModels(this);
  }

  get selector() {
    return [...this.entries()].map(([id, { name }]) => [id, name]);
  }
}

export default DeviceModels;
