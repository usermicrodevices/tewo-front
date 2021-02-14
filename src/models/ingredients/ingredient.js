import Datum from 'models/datum';
import { computed, observable } from 'mobx';

import { FORMAT } from 'elements/format';

class Ingridient extends Datum {
  @observable id = null;

  @observable name = null;

  @observable companyId = null;

  @observable cost = null;

  @observable unitId = null;

  session;

  constructor(session) {
    super(session.ingredients.update);

    this.session = session;
  }

  @computed get measureUnit() {
    return this.session.units.get(this.unitId)?.name || null;
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

  @computed get currency() {
    const { company } = this;
    return company && company.currency;
  }

  @computed get currencyName() {
    const { currency } = this;
    return currency ? currency.name : currency;
  }

  @computed get drinksId() {
    return this.session.drinks.getByIngredient(this.id).map(({ id }) => id);
  }

  get editable() {
    return {
      name: {
        type: 'text',
        isRequired: true,
      },
      cost: {
        type: 'number',
        isRequired: true,
      },
      dimension: {
        type: 'text',
        isRequired: true,
      },
      companyId: {
        type: 'selector',
        selector: this.session.companies.selector,
        isRequired: true,
      },
    };
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
        dataIndex: 'cost',
        title: 'Цена за единицу',
        value: FORMAT.format(this.cost?.toString()),
      },
      {
        dataIndex: 'dimension',
        title: 'Единица измерения',
        value: this.dimension,
      },
      {
        dataIndex: 'companyId',
        title: 'Компания',
        value: this.companyName,
      },
    ];
  }
}

export default Ingridient;
