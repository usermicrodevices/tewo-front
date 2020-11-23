/* eslint no-param-reassign: off */
import { get, patch, post, del } from 'utils/request';
import checkData from 'utils/dataCheck';

import Mailing from 'models/mailings/mailing';

const LOCATION = '/refs/notification_bulk_emails/';
const EMAIL_SEPARATOR = ';';
const RENAMER = {
  companyId: 'company',
};
const formaters = {
  company: (data) => data.companyId,
  name: (data) => data.name,
  notifications: (data) => (Array.isArray(data.notifications) ? data.notifications : []),
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
    id: 'number',
    sale_point: 'number',
    sources: 'array',
  };

  if (!checkData(data, shouldBe)) {
    console.error(`обнаружены ошибки при обработке эндпоинта ${LOCATION}`);
  }

  const notifications = [];
  for (let i = 0; i < data.notifications.length; i += 1) {
    if (!checkData(data.notifications[i], notificationShouldBe)) {
      console.error(`обнаружены ошибки при обработке эндпоинта ${LOCATION} для поля notifications`, data.notifications[i]);

      return mailing;
    }

    notifications.push({
      salePoint: data.notifications[i].sale_point,
      sources: data.notifications[i].sources,
    });
  }

  mailing.id = data.id;
  mailing.name = data.name;
  mailing.emails = data.emails.split(EMAIL_SEPARATOR);
  mailing.notifications = data.notifications;
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
      console.error(`${LOCATION} ожидаеся в ответ массив, получен ${typeof mailings}`, mailings);
    }

    const results = mailings.map((mailing) => transform(mailing, new Mailing(session)));

    resolve({
      results,
      count: results.length,
    });
  }).catch(reject);
});

const applyMailing = async (id, changes) => {
  const data = form(changes);

  // Reuired fields when create
  if (!id) {
    data.emails = data.emails || '';
    data.notifications = data.notifications || [];
  }

  const request = id === null ? post(LOCATION, data) : patch(`${LOCATION}${id}`, data);

  const response = await request;

  return transform(response, {});
};

const deleteMailing = (id) => del(`${LOCATION}${id}`);

export { getMailings, deleteMailing, applyMailing };
