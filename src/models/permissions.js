import { observable } from 'mobx';
import { getPackagesPermissions, getBeveragesPermissions } from 'services/packages';

class Permissions {
  @observable permissions = {
    packages: [],
    beverages: [],
  }

  constructor() {
    this.getPackagesPermissions();
    this.getBeveragesPermissions();
  }

  checkPermission(scope, permission) {
    if (!this.permissions[scope] || !Array.isArray(this.permissions[scope])) {
      console.warn(`Undefined permission scope ${scope}!`);
      return false;
    }

    return this.permissions[scope].includes(permission);
  }

  isAllowDelete(scope) {
    return this.checkPermission(scope, 'delete');
  }

  getPackagesPermissions = () => {
    getPackagesPermissions().then((permissions) => {
      this.permissions.packages = permissions;
    });
  }

  getBeveragesPermissions = () => {
    getBeveragesPermissions().then((permissions) => {
      this.permissions.beverages = permissions;
    });
  }
}

export default Permissions;
