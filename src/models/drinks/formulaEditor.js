/* eslint class-methods-use-this: "off" */
import { computed, observable, action } from 'mobx';

class FormulaEditor {
  drink;

  name = 'Рецептура';

  editable = {};

  @observable formula;

  session;

  constructor(drink, session) {
    this.session = session;
    this.drink = drink;
    this.cancel();
  }

  @computed get values() {
    return [];
  }

  @computed get elems() {
    const { selector } = this.session.ingredients;
    return this.formula.map(({ id, amount }) => ({
      id,
      amount,
      selector,
      ingredient: id ? this.session.ingredients.get(id) : id,
    }));
  }

  @action setIngredient(itm, val) {
    this.formula[itm].id = val;
  }

  @action setAmount(itm, val) {
    this.formula[itm].amount = val;
  }

  @action add() {
    this.formula.push({ id: null, amount: null });
  }

  @action remove(id) {
    this.formula.splice(id, 1);
  }

  @action cancel() {
    this.formula = this.drink.isHaveFormula ? JSON.parse(JSON.stringify(this.drink.formula.slice())) : [];
  }

  update() {
    const formula = this.formula.filter(({ id, amount }) => id !== null && amount !== null);
    if (JSON.stringify(this.drink.formula) === JSON.stringify(formula)) {
      this.cancel();
      return Promise.resolve();
    }
    return Promise.resolve().then(() => {
      this.drink.formula.replace(formula);
    });
  }
}

export default FormulaEditor;
