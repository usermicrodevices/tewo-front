import axios from 'axios';

import { apiUrl as baseURL } from 'config';
import localStorage from 'mobx-localstorage';

const BEARER_KEY = 'unusual_bearer_key';

const request = () => axios.create({
  baseURL,
  headers: (() => {
    const bearer = localStorage.getItem(BEARER_KEY);
    if (typeof bearer === 'string') {
      return { authorization: `bearer ${bearer}` };
    }
    return {};
  })(),
});

const get = (endpoint) => request().get(endpoint).then(({ data }) => data);

const post = (endpoint, data) => request().post(endpoint, data).then(({ data: result }) => result);

export { get, post, BEARER_KEY };
