/* eslint no-param-reassign: off */
import moment from 'moment';

import { get, patch } from 'utils/request';
import Company from 'models/companies/company';
import checkData from 'utils/dataCheck';

const LOCATION = '/refs/companies/';

const transform = (data, company) => {
  const shouldBe = {
    created_date: 'date',
    id: 'number',
    name: 'string',
  };

  const mayBe = {
    city: 'number',
    secret: 'string',
    emails: 'string',
    phone: 'string',
    group: 'number',
    contact_people: 'string',
    threshold_drinks_cleaning: 'number',
    currency: 'number',
  };

  if (!checkData(data, shouldBe, mayBe)) {
    console.error(`обнаружены ошибки при обработке эндпоинта ${LOCATION}`);
  }

  company.id = data.id;
  company.name = data.name;
  company.city = data.city;
  company.secret = data.secret;
  company.emails = data.emails;
  company.phone = data.phone;
  company.group = data.group;
  company.contactPeople = data.contact_people;
  company.currencyId = data.currency;
  company.created = moment(data.created_date);

  return company;
};

const getCompanies = (session) => () => new Promise((resolve, reject) => {
  get(LOCATION).then((companies) => {
    if (!Array.isArray(companies)) {
      console.error(`${LOCATION} ожидаеся в ответ массив, получен ${typeof companies}`, companies);
    }

    resolve({
      count: companies.length,
      results: companies.map((data) => transform(data, new Company(session))),
    });
  }).catch(reject);
});

const patchCompany = (id, data) => patch(`${LOCATION}${id}`, {
  contact_people: data.contactPeople,
  name: data.name,
  phone: data.phone,
  emails: data.emails,
}).then((result) => transform(result, {}));

export { getCompanies, patchCompany };
