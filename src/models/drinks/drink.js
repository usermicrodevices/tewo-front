import { computed, observable } from 'mobx';

import Datum from 'models/datum';

class Drink extends Datum {
  @observable id = null;

  @observable plu = null;

  @observable name = '';

  @observable companyId = null;

  @observable recipe = [];

  @observable nds = null;

  session;

  constructor(session) {
    super(session.drinks.update);

    this.session = session;
  }

  @computed get isHaveRecipe() {
    return this.recipe.length > 0;
  }

  @computed get company() {
    return this.session.companies.get(this.companyId);
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
        dataIndex: 'plu',
        title: 'PLU',
        value: this.plu,
      },
      {
        dataIndex: 'nds',
        title: 'НДС',
        value: this.nds,
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
      plu: {
        type: 'number',
        isRequired: true,
      },
      nds: {
        type: 'number',
      },
    };
  }

  validation(data) {
    const { plu: inputPLU, companyId } = data;
    const { drinks } = this.session.companies.get(companyId);
    if (Array.isArray(drinks)) {
      const problem = drinks.find((itm) => itm.plu === inputPLU && itm !== this);
      if (typeof problem !== 'undefined') {
        return `${problem.name} имеет значение PLU ${inputPLU}`;
      }
    }
    return true;
  }
}

export default Drink;
