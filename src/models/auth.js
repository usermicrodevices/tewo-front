import { observable, action } from 'mobx';
import localStorage from 'mobx-localstorage';

class Auth {
  @observable me = null;

  @action logout() {
    this.me = null;
    localStorage.clear();
  }
}

export function isAuthorized() {
  return false;
}

export function login({ username, password }) {
  console.log(username, password);
}

export default Auth;
