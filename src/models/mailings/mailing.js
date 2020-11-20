import { computed } from 'mobx';

class Mailing {
  id;

  name;

  companyId;

  notifications = [];

  emails = [];

  constructor(session) {
    this.session = session;
  }

  @computed get company() {
    const { companyId } = this;
    if (typeof companyId !== 'number') {
      return companyId;
    }
    return this.session.companies.get(companyId);
  }

  @computed get companyName() {
    const { company } = this;

    return company ? company.name : undefined;
  }
}

export default Mailing;
