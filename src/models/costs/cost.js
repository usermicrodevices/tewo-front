import { computed } from 'mobx';

import Datum from 'models/datum';

class Cost extends Datum {
  session;

  constructor(session) {
    super(Promise.resolve);

    this.session = session;
  }

  @computed get company() {
    if (typeof this.companyId !== 'number') {
      return this.companyId;
    }
    return this.session.comanies.get(this.companyId);
  }

  @computed get companyName() {
    const { company } = this;
    if (!company) {
      return company;
    }
    return company.name;
  }

  @computed get devices() {
    if (!Array.isArray(this.devicesIds)) {
      return [];
    }
    return this.devicesIds.map((id) => this.session.devices.get(id));
  }
}

export default Cost;
