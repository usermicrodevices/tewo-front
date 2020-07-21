class User {
  id;

  username;

  email;

  firstName;

  lastName;

  isActive;

  isStaff;

  isSuperuser;

  permissions;

  get name() {
    const name = `${this.firstName} ${this.lastName}`;
    if (name.length > 1) {
      return name;
    }
    return this.username;
  }

  get avatarSymbols() {
    const avatarContent = () => {
      if (this.firstName.length > 0) {
        if (this.lastName.length > 0) {
          return `${this.firstName.slice(0, 1)}${this.lastName.slice(0, 1)}`;
        }
        return this.firstName.slice(0, 2);
      }
      if (this.lastName.length > 0) {
        return this.lastName.slice(0, 2);
      }
      return '';
    };
    return avatarContent().toUpperCase();
  }
}

export default User;
