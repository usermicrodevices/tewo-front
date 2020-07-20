import { post } from 'utils/request';

function login(data) {
  return post('login', data);
}

function me() {
  return Promise.resolve({});
}

export { login, me };
