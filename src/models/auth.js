import { observable, computed, action } from 'mobx';
import localStorage from 'mobx-localstorage';
import { BEARER_KEY } from 'utils/request';

import { login, me } from 'services/user';

class Auth {
  @observable user = undefined;

  constructor() {
    if (localStorage.getItem(BEARER_KEY) === null) {
      this.logout();
    } else {
      me()
        .then((user) => { this.user = user; })
        .catch(() => { this.logout(); });
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
    return new Promise((resolve, reject) => {
      login(data)
        .then((token) => {
          localStorage.setItem(BEARER_KEY, token);
          me().then((user) => {
            resolve(user);
            this.user = user;
          }).catch((err) => {
            reject(err);
            this.logout();
          });
        })
        .catch(reject);
    });
  }
}

export default Auth;
