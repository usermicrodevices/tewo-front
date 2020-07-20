import { post, get } from 'utils/request';

function login(data) {
  return new Promise((resolve, reject) => {
    post('login', data).then((response) => {
      if (Object.keys(response.data).length !== 1 || typeof response.data.token !== 'string') {
        reject(new Error(response));
      }
      resolve(response.data.token);
    }).catch(reject);
  });
}

function me() {
  return new Promise((resolve, reject) => {
    get('user').then(({ data }) => {
      resolve(data);
    }).catch(reject);
  });
}

export { login, me };
