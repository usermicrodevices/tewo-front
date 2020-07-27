import getCompanies from 'services/companies';

class Session {
  companiesCache = null;

  getCompanies() {
    if (this.companiesCache !== null) {
      return Promise.resolve(this.companiesCache);
    }
    return getCompanies().then((companies) => { this.companiesCache = companies; return companies; });
  }
}

export default Session;
