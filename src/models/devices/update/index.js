import { observable } from 'mobx';

import postPackage from 'services/packages';

import Packages from './packages';
import Package from './package';
import Devices from './devices';

class DeviceUpdate {
  devices;

  packages;

  session;

  @observable newPackage = null;

  constructor(session) {
    this.devices = new Devices(session);
    this.packages = new Packages(session);
    this.session = session;
  }

  chreatePackage() {
    this.newPackage = new Package(this.session);
  }

  submitNewPackage() {
    postPackage(this.newPackage).then(() => {
      this.packages.rawData.push(this.newPackage);
      this.clearNewPackage();
    });
  }

  clearNewPackage() {
    this.newPackage = null;
  }
}

export default DeviceUpdate;
