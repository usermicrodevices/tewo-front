import { getRoles } from 'services/users';

class UserRoles extends Map {
  constructor() {
    super();

    getRoles(this);
  }

  get selector() {
    return [...this.entries()].map(([id, name]) => [id, name]);
  }
}

export default UserRoles;
