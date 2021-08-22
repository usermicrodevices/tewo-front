import { observable } from 'mobx';
import { getPermissions as getPackagesPermissions } from 'services/packages';

class Permissions {
  @observable packages = []

  constructor() {
    this.getPackagesPermissions();
  }

  getPackagesPermissions = () => {
    getPackagesPermissions().then((permissions) => {
      this.packages = permissions;
    });
  }
}

export default Permissions;
