import { observable, action } from 'mobx';
import localStorage from 'mobx-localstorage';
import { post } from 'utils/request';

class Auth {
  @observable me = null;

  @action logout() {
    this.me = null;
    localStorage.clear();
  }
}

export function checkAuthorisation() {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(true); }, 500);
  });
}

export function login(data) {
  return post('/login', data)
    .then((result) => {
      console.log(result);
    });
}

export default Auth;
