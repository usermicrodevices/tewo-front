import { observable } from 'mobx';
import { getRoles } from 'services/users';

class UserRoles {
  constructor() {
    this.map = observable.map();

    getRoles({
      set: (key, value) => {
        this.map.set(key, value);
      },
    });
  }

  get selector() {
    return [...this.map.entries()];
  }

  get(key) {
    return this.map.get(key);
  }

  set(key, value) {
    this.map.set(key, value);
  }
}

export default UserRoles;
