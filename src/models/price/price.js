import { action, computed, observable } from 'mobx';

import Datum from 'models/datum';

class Price extends Datum {
  session;

  drinkId;

  groupId;

  @observable value;

  @observable codeExt;

  id;

  constructor(session) {
    super(session.prices.patch);

    this.session = session;
  }

  editable = {
    value: {
      type: 'number',
      isRequired: true,
    },
    codeExt: {
      type: 'number',
      isRequired: false,
    },
  };

  @computed get values() {
    return [
      {
        dataIndex: 'value',
        title: 'Цена',
        value: this.value,
      },
    ];
  }

  @computed get drink() {
    return this.session.drinks.get(this.drinkId);
  }

  @computed get plu() {
    return this.drink?.plu;
  }

  @computed get name() {
    return this.drink?.name;
  }

  @computed get nds() {
    return this.drink?.ndsName;
  }

  @computed get group() {
    return this.session.priceGroups.get(this.groupId);
  }

  @computed get currency() {
    return this.group?.currency?.name;
  }

  @action setValue(value, codeExt) {
    return this.update({ value, codeExt });
  }
}

export default Price;
