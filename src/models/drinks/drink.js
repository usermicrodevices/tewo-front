import { computed, observable } from 'mobx';

import Datum from 'models/datum';

class Drink extends Datum {
  @observable id = null;

  @observable productUid = null;

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

  @computed get ndsName() {
    return this.nds && this.session.nds.get(this.nds);
  }

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'plu',
        title: 'PLU',
        value: this.plu,
      },
      {
        dataIndex: 'productUid',
        title: 'uid продукта',
        value: this.productUid,
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
        dataIndex: 'nds',
        title: 'НДС',
        value: this.ndsName,
      },
    ];
  }

  get editable() {
    const plu = this.id === null ? {
      plu: {
        type: 'number',
        isRequired: true,
      },
    } : {};
    return {
      name: {
        type: 'text',
        isRequired: true,
      },
      productUid: {
        type: 'text',
      },
      companyId: {
        type: 'selector',
        selector: this.session.companies.selector,
        isRequired: true,
      },
      nds: {
        type: 'selector',
        selector: this.session.nds.selector,
        isRequired: true,
      },
      ...plu,
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
