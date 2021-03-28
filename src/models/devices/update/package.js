import { observable } from 'mobx';

class Package {
  @observable devices = new Set();
}

export default Package;
