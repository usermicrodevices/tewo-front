import { observable, computed, action } from 'mobx';
import localStorage from 'mobx-localstorage';
import { BEARER_KEY } from 'utils/request';

import { login } from 'services/user';

class Auth {
  @observable user = undefined;

  constructor() {
    if (localStorage.getItem(BEARER_KEY) === null) {
      this.logout();
    } else {
      setTimeout(() => { this.user = {}; }, 500);
    }
  }

  @computed get isAuthorized() {
    return typeof this.user === 'object' && this.user !== null;
  }

  @computed get isAuthChecked() {
    return typeof this.user === 'object';
  }

  @action logout() {
    this.user = null;
    localStorage.clear();
  }

  @action login(data) {
    return login(data)
      .then(() => {
        localStorage.setItem(BEARER_KEY, 'xxx');
        this.user = {};
      });
  }
}

export default Auth;
