import { computed, observable, reaction } from 'mobx';

class DiagramPopularity {
  generic;

  session;

  @observable beverages;

  @computed get chart() {
    if (typeof this.beverages === 'undefined') {
      return undefined;
    }
    let sum = 0;
    for (const { beverages } of this.beverages.slice(4)) {
      sum += beverages;
    }
    const result = this.beverages.slice(0, 4).map(({ beverages, drinkId }) => ({
      label: this.session.drinks.get(drinkId)?.name,
      count: beverages,
      id: drinkId,
    }));
    if (sum !== 0) {
      result.push({ label: 'Остальные', count: sum });
    }
    return result;
  }

  @computed get isLoaded() {
    return typeof this.beverages !== 'undefined';
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const updateValue = () => {
      this.beverages = undefined;
      if (typeof this.generic.salePointsId === 'undefined') {
        return;
      }
      this.session.points.getSalesTop(this.generic.salePointsId, this.generic.dateRange).then((result) => {
        this.beverages = result.sort(({ beverages: a }, { beverages: b }) => Math.sign(b - a));
      });
    };
    reaction(() => [this.generic.salePointsId, this.generic.dateRange], updateValue);
    updateValue();
  }
}

export default DiagramPopularity;
