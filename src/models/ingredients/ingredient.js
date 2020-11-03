import Datum from 'models/datum';
import { computed } from 'mobx';

class Ingridient extends Datum {
  id;

  name;

  dimension;

  companyId;

  cost;

  currency;

  dimension;

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
    cost: {
      type: 'number',
    },
    currency: {
      type: 'text',
    },
    dimension: {
      type: 'text',
    },
    companyName: {
      type: 'selector',
      selector: this.session.companies.selector,
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
        dataIndex: 'cost',
        title: 'Цена за единицу',
        value: this.cost,
      },
      {
        dataIndex: 'currency',
        title: 'Валюта',
        value: this.currency,
      },
      {
        dataIndex: 'dimension',
        title: 'Единица измерения',
        value: this.dimension,
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
