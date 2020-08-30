import { computed } from 'mobx';

class FormulaEditor {
  drink;

  editable = {};

  constructor(drink) {
    this.drink = drink;
  }

  @computed get values() {
    return [
      {
        dataIndex: 'name',
        title: 'Название напитка',
        value: this.drink.name,
      },
    ];
  }
}

export default FormulaEditor;
