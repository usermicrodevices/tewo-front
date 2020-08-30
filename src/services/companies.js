import moment from 'moment';

import { get } from 'utils/request';
import Company from 'models/companies/company';
import checkData from 'utils/dataCheck';

const getCompanies = (session) => () => new Promise((resolve, reject) => {
  const location = '/refs/companies/';
  get(location).then((companies) => {
    if (!Array.isArray(companies)) {
      console.error(`/refs/companies ожидаеся в ответ массив, получен ${typeof companies}`, companies);
    }

    resolve({
      count: companies.length,
      results: companies.map((data) => {
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
        };

        if (!checkData(data, shouldBe, mayBe)) {
          console.error(`обнаружены ошибки при обработке эндпоинта ${location}`);
        }

        const company = new Company(session);
        company.id = data.id;
        company.name = data.name;
        company.city = data.city;
        company.secret = data.secret;
        company.emails = data.emails;
        company.phone = data.phone;
        company.group = data.group;
        company.contactPeople = data.contact_people;
        company.created = moment(data.created_date);

        return company;
      }),
    });
  }).catch(reject);
});

export default getCompanies;
