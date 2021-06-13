import axios from 'axios';

import { apiUrl as baseURL } from 'config';
import localStorage from 'mobx-localstorage';

const BEARER_KEY = 'unusual_bearer_key';

const request = (() => axios.create({
  baseURL,
}))();

request.interceptors.request.use((config) => {
  const bearer = localStorage.getItem(BEARER_KEY);

  if (typeof bearer === 'string') {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `bearer ${bearer}`;
  }

  return config;
});

const get = (endpoint, config) => request.get(endpoint, config).then(({ data }) => data);

const post = (endpoint, data) => request.post(endpoint, data).then(({ data: result }) => result);

const patch = (endpoint, data) => request.patch(endpoint, data).then(({ data: result }) => result);

const del = (endpoint) => request.delete(endpoint).then(({ data: result }) => result);

const blob = (endpoint) => get(endpoint, { responseType: 'blob' });

export {
  get, post, patch, del, blob, BEARER_KEY,
};
