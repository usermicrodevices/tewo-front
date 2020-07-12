import { computed, observable } from 'mobx';

class Auth {
  @observable me = null;

  @computed get isAuthorized() {
    return this.me !== null;
  }
}

export function isAuthorized() {
  return false;
}

export function login({ username, password }) {
  console.log(username, password);
}

export default Auth;
