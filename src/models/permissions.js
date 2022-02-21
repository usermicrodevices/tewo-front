import { observable } from 'mobx';
import { getPackagesPermissions, getBeveragesPermissions } from 'services/packages';
import { getEventReferencesPermissions } from 'services/events';

class Permissions {
  @observable permissions = {
    packages: [],
    beverages: [],
    eventReferences: [],
  }

  constructor() {
    this.registerScopePermissions('packages', getPackagesPermissions);
    this.registerScopePermissions('beverages', getBeveragesPermissions);
    this.registerScopePermissions('eventReferences', getEventReferencesPermissions);
  }

  checkPermission(scope, permission) {
    if (!this.permissions[scope] || !Array.isArray(this.permissions[scope])) {
      console.warn(`Undefined permission scope ${scope}!`);
      return false;
    }

    return this.permissions[scope].includes(permission);
  }

  isAllowView(scope) {
    return this.checkPermission(scope, 'view');
  }

  isAllowDelete(scope) {
    return this.checkPermission(scope, 'delete');
  }

  registerScopePermissions = (scope, getter) => {
    getter().then((permissions) => {
      this.permissions[scope] = permissions;
    });
  }
}

export default Permissions;
