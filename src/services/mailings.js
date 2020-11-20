/* eslint no-param-reassign: off */
import moment from 'moment';

import { get, patch } from 'utils/request';
import checkData from 'utils/dataCheck';

import Mailing from 'models/mailings/mailing';

const LOCATION = '/refs/notification_bulk_emails/';

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
  mailing.emails = data.emails.split(';');
  mailing.notifications = data.notifications;
  mailing.companyId = data.company;

  return mailing;
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

const patchMailing = (id, data) => patch(`${LOCATION}${id}`, {
  name: data.name,
  emails: data.emails,
  notifications: data.notifications,
}).then((result) => transform(result, {}));

export { getMailings, patchMailing };
