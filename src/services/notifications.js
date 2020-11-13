import { get, patch, post } from 'utils/request';
import checkData from 'utils/dataCheck';

export const getNotificationTypes = (acceptor) => get('/refs/notification_types/').then((json) => {
  if (Array.isArray(json)) {
    for (const item of json) {
      if (checkData(item, { id: 'number', name: 'string', value: 'string' })) {
        acceptor.set(item.id, { name: item.name, value: item.value });
      } else {
        console.error('unexpected notification_type response');
      }
    }
  } else {
    console.error('unexpected notification_type response');
  }
});

export const getNotificationSources = (acceptor) => get('/refs/notification_sources/').then((json) => {
  if (Array.isArray(json)) {
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
        console.error('unexpected notification_source response');
      }
    }
  } else {
    console.error('unexpected notification_source response');
  }
});

export const getNotificationSettings = () => get('/api/refs/notification_options/current/').then((json) => {
  if (Array.isArray(json)) {
    for (const item of json) {
      if (checkData(item, {
        id: 'number', source: 'number', sale_point: 'number', types: 'array',
      })) {
        // todo
      } else {
        console.error('unexpected notification_settings response');
      }
    }
  } else {
    console.error('unexpected notification_settings response');
  }
});
