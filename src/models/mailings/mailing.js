import { computed, observable } from 'mobx';

import Datum from 'models/datum';

class Mailing extends Datum {
  @observable id = null;

  @observable name = '';

  @observable companyId = null;

  @observable notifications = [];

  @observable emails = [];

  constructor(session) {
    super(session.mailings.update);

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
    return this.company?.name;
  }

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
      {
        dataIndex: 'companyId',
        title: 'Компания',
        value: this.companyName,
      },
      {
        dataIndex: 'emails',
        title: 'Адреса',
        value: this.emails,
      },
    ];
  }

  get editable() {
    return {
      name: {
        type: 'text',
        isRequired: true,
      },
      companyId: {
        type: 'selector',
        selector: this.session.companies.selector,
        isRequired: true,
      },
      emails: {
        type: 'tags',
        selector: this.emails,
        isRequired: true,
      },
    };
  }
}

export default Mailing;
