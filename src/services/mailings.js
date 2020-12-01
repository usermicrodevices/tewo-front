/* eslint no-param-reassign: off */
import {
  get, patch, post, del,
} from 'utils/request';
import checkData from 'utils/dataCheck';

import Mailing from 'models/mailings/mailing';
import apiCheckConsole from 'utils/console';

const LOCATION = '/refs/notification_bulk_emails/';
const EMAIL_SEPARATOR = ';';

const RENAMER = {
  companyId: 'company',
};

const formaters = {
  company: (data) => data.companyId,
  name: (data) => data.name,
  notifications: (data) => {
    const notifications = [];

    for (const [pointId, { sources, id }] of data.notifications.entries()) {
      const notification = {
        sources: [...sources],
      };

      if (id) {
        notification.id = id;
      } else {
        notification.sale_point = pointId;
      }

      notifications.push(notification);
    }

    return notifications;
  },
  emails: (data) => (Array.isArray(data.emails) ? data.emails.join(EMAIL_SEPARATOR) : ''),
};

const transform = (data, mailing) => {
  const shouldBe = {
    id: 'number',
    name: 'string',
    emails: 'string',
    notifications: 'array',
    company: 'number',
  };

  const notificationShouldBe = {
    sale_point: 'number',
    sources: 'array',
  };

  const notificationMayBe = {
    id: 'number',
  };

  if (!checkData(data, shouldBe)) {
    apiCheckConsole.error(`обнаружены ошибки при обработке эндпоинта ${LOCATION}`);
  }

  if (Array.isArray(data.notifications)) {
    for (let i = 0; i < data.notifications.length; i += 1) {
      if (!checkData(data.notifications[i], notificationShouldBe, notificationMayBe)) {
        apiCheckConsole.error(`обнаружены ошибки при обработке эндпоинта ${LOCATION} для поля notifications`, data.notifications[i]);

        return mailing;
      }

      const { sources, sale_point: salePointId, id } = data.notifications[i];

      mailing.notifications.set(salePointId, {
        sources: new Set(sources),
        id,
      });
    }
  }

  mailing.id = data.id;
  mailing.name = data.name;
  mailing.emails = data.emails.split(EMAIL_SEPARATOR);
  mailing.companyId = data.company;

  return mailing;
};

const form = (data) => {
  const json = {};

  const getKey = (key, renamer) => renamer[key] || key;

  for (const [key, value] of Object.entries(data)) {
    if (formaters[key]) {
      json[getKey(key, RENAMER)] = formaters[key](data);
    } else {
      json[getKey(key, RENAMER)] = value;
    }
  }

  return json;
};

const getMailings = (session) => () => new Promise((resolve, reject) => {
  get(LOCATION).then((mailings) => {
    if (!Array.isArray(mailings)) {
      apiCheckConsole.error(`${LOCATION} ожидаеся в ответ массив, получен ${typeof mailings}`, mailings);
    }

    const results = mailings.map((mailing) => transform(mailing, new Mailing(session)));

    resolve({
      results,
      count: results.length,
    });
  }).catch(reject);
});

const applyMailing = async (id, changes, session, currentMailing) => {
  const data = form(changes);

  // Reuired fields when create
  if (!id) {
    data.emails = data.emails || '';
    data.notifications = data.notifications || [];
  }

  const request = id === null ? post(LOCATION, data) : patch(`${LOCATION}${id}/`, data);

  const response = await request;

  return transform(response, currentMailing || new Mailing(session));
};

const deleteMailing = (id) => del(`${LOCATION}${id}`);

export { getMailings, deleteMailing, applyMailing };
