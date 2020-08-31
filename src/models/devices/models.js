import { getDeviceModels } from 'services/device';

class DeviceModels extends Map {
  constructor() {
    super();

    getDeviceModels(this);
  }
}

export default DeviceModels;
