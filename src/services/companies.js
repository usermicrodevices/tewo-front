import moment from 'moment';

import { get } from 'utils/request';
import Company from 'models/companies/company';
import checkData from 'utils/dataCheck';

const getCompanies = (session) => () => new Promise((resolve, reject) => {
  get('/refs/companies/').then((companies) => {
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
        checkData(data, shouldBe);

        const company = new Company(session);
        company.id = data.id;
        company.name = data.name;
        company.created = moment(data.created_date);

        return company;
      }),
    });
  }).catch(reject);
});

export default getCompanies;
