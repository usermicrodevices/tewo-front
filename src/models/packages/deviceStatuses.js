import { observable } from 'mobx';
import { getDeviceStatuses } from 'services/packages';

class DeviceStatuses extends observable.map {
  constructor() {
    super();
    getDeviceStatuses(this);
  }
}

export default DeviceStatuses;
