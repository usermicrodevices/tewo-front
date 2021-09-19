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

const GET_REQUESTS = {};

/**
 * Делает get-запрос, если он уже не делается в данный момент.
 * Если делается то будет отдан результат выполняемого запроса
 * @param endpoint
 * @param config
 * @returns Promise<Object>
 */
const get = (endpoint, config) => {
  if (endpoint in GET_REQUESTS) {
    return GET_REQUESTS[endpoint];
  }
  GET_REQUESTS[endpoint] = request.get(endpoint, config).then(({ data }) => data);
  GET_REQUESTS[endpoint].finally(() => {
    delete GET_REQUESTS[endpoint];
  });
  return GET_REQUESTS[endpoint];
};

/**
 * Возвращает запрашивалку, которая делает запрос и после получения ответа
 * проверяет, был-ли делались-ли запросы после через неё же. Если делались,
 * то подменяет ответ на тот, что пришел из следующего запроса.
 */
const sequentialGet = (space) => {
  const lastRequest = {};
  const result = (endpoint, config) => new Promise((resolve, reject) => {
    const req = get(endpoint, config).then((response) => {
      if (req === lastRequest.id) {
        resolve(response);
      } else {
        lastRequest.req.then(resolve, reject);
      }
      return response;
    });
    lastRequest.req = req;
  });
  return result;
};

const post = (endpoint, data) => request.post(endpoint, data).then(({ data: result }) => result);

const patch = (endpoint, data) => request.patch(endpoint, data).then(({ data: result }) => result);

const del = (endpoint) => request.delete(endpoint).then(({ data: result }) => result);

const blob = (endpoint) => get(endpoint, { responseType: 'blob' });

export {
  get, post, patch, del, blob, BEARER_KEY, sequentialGet,
};
