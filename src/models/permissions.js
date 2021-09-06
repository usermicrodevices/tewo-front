import { observable, computed } from 'mobx';
import { getPermissions as getPackagesPermissions } from 'services/packages';

class Permissions {
  @observable packages = [];

  constructor() {
    this.getPackagesPermissions();
  }

  checkPermission(permission) {
    return Boolean(this.packages.find((perm) => perm === permission));
  }

  @computed get isAllowDelete() {
    return this.checkPermission('delete');
  }

  getPackagesPermissions = () => {
    getPackagesPermissions().then((permissions) => {
      this.packages = permissions;
    });
  }
}

export default Permissions;
