import { transaction } from 'mobx';

import {
  get, post, patch, del,
} from 'utils/request';
import apiCheckConsole from 'utils/console';
import checkData from 'utils/dataCheck';

export const getNotificationTypes = (acceptor) => get('/refs/notification_types/').then((json) => {
  if (Array.isArray(json)) {
    for (const item of json) {
      if (checkData(item, { id: 'number', name: 'string', value: 'string' })) {
        acceptor.set(item.id, { name: item.name, value: item.value });
      } else {
        apiCheckConsole.error('unexpected notification_type response');
      }
    }
  } else {
    apiCheckConsole.error('unexpected notification_type response');
  }
});

export const getNotificationSources = (acceptor) => get('/refs/notification_sources/').then((json) => {
  if (Array.isArray(json)) {
    transaction(() => {
      for (const item of json) {
        if (checkData(item, {
          id: 'number', name: 'string', value: 'string', description: 'string', group: 'number',
        })) {
          acceptor.set(item.id, {
            name: item.name,
            value: item.value,
            description: item.description,
          });
        } else {
          apiCheckConsole.error('unexpected notification_source response');
        }
      }
    });
  } else {
    apiCheckConsole.error('unexpected notification_source response');
  }
});

export const getNotificationSettings = () => get('/refs/notification_options/current/').then((json) => {
  if (Array.isArray(json)) {
    const result = {}; // {[sale_point_id]: {[source_id]: {types: [1,2,...]}}}

    for (const item of json) {
      if (checkData(item, {
        id: 'number', source: 'number', sale_point: 'number', types: 'array', owner: 'number',
      })) {
        if (!result[item.sale_point]) {
          result[item.sale_point] = {};
        }

        result[item.sale_point][item.source] = {
          types: item.types,
        };
      } else {
        apiCheckConsole.error('unexpected notification_settings response');
      }
    }

    return result;
  }

  apiCheckConsole.error('unexpected notification_settings response');
  return undefined;
});

export const updateNotificationSettings = (settings) => {
  const isAllKeysNumbers = Object.keys(settings).every((k) => Number.isInteger(Number(k)));
  const isAllNestedKeysNumbers = [].concat(...Object.values(settings).map((v) => Object.keys(v))).every((k) => Number.isInteger(Number(k)));
  const isAllNestedValuesArraysOfNumbers = [].concat(...Object.values(settings).map((v) => Object.values(v)))
    .every((nestedV) => Array.isArray(nestedV) && nestedV.every((k) => Number.isInteger(Number(k))));

  const isSettingsCorrect = isAllKeysNumbers && isAllNestedKeysNumbers && isAllNestedValuesArraysOfNumbers;

  if (!isSettingsCorrect) {
    apiCheckConsole.error('unexpected settings format', {
      isAllKeysNumbers, isAllNestedKeysNumbers, isAllNestedValuesArraysOfNumbers,
    });

    return Promise.reject();
  }

  return post('/refs/notification_options/sale_points/', settings).then((json) => json);
};

export const getNotificationDelays = () => get('/refs/notification_delays/current/').then((json) => {
  if (Array.isArray(json)) {
    const result = []; // {id: Number, inerval: Number, source: Number}[]

    for (const item of json) {
      if (checkData(item, {
        id: 'number', source: 'number', interval: 'number', owner: 'number',
      })) {
        result.push(item);
      } else {
        apiCheckConsole.error('unexpected notification_delay response');
      }
    }

    return result;
  }

  apiCheckConsole.error('unexpected notification_delay response');
  return undefined;
});

export const createNotificationDelay = ({ interval, source }) => post('/refs/notification_delays/', { interval, source }).then((json) => json);

export const updateNotificationDelay = ({ id, interval, source }) => patch(`/refs/notification_delays/${id}/`, { interval, source }).then((json) => json);

export const deleteNotificationDelay = ({ id }) => del(`/refs/notification_delays/${id}/`).then((json) => json);
