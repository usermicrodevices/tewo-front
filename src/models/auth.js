import { observable, computed, action } from 'mobx';
import localStorage from 'mobx-localstorage';
import { post, BEARER_KEY } from 'utils/request';

class Auth {
  @observable user = undefined;

  constructor() {
    setTimeout(() => { this.user = localStorage.getItem(BEARER_KEY) === 'xxx' ? {} : null; }, 500);
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
    return new Promise((resolve) => { setTimeout(resolve, 500); })
      .then(() => {
        localStorage.setItem(BEARER_KEY, 'xxx');
        this.user = {};
      });
  }
}

export default Auth;
