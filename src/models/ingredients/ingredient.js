import Datum from 'models/datum';
import { computed } from 'mobx';

class Ingridient extends Datum {
  id;

  name;

  dimension;

  companyId;

  session;

  constructor(session) {
    super(Promise.resolve);

    this.session = session;
  }

  @computed get company() {
    return this.session.companies.get(this.companyId);
  }

  @computed get companyName() {
    const { company } = this;
    if (typeof company !== 'object' || company === null) {
      return company;
    }
    return company.name;
  }

  editable = {
    name: {
      type: 'text',
    },
  };

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
        dataIndex: 'companyName',
        title: 'Компания',
        value: this.companyName,
      },
    ];
  }
}

export default Ingridient;
