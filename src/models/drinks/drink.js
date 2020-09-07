import { computed, observable } from 'mobx';

import Datum from 'models/datum';

class Drink extends Datum {
  id;

  plu;

  name;

  companyId;

  @observable recipe = { id: null, ingredients: [] };

  session;

  constructor(session) {
    super(() => Promise.resolve());

    this.session = session;
  }

  @computed get isHaveRecipe() {
    return this.recipe.id !== null;
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
        dataIndex: 'plu',
        title: 'PLU',
        value: this.plu,
      },
    ];
  }

  editable = {};
}

export default Drink;
