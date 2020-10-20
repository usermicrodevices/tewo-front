import { computed } from 'mobx';

class LastBeverages {
  session;

  generic;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    this.update();
  }

  @computed get isLoaded() {
    return this.session.beverages.isLoaded;
  }

  @computed get rows() {
    const pointsSet = this.generic.salePointsId === null ? { has: () => true } : new Set(this.generic.salePointsId);
    return this.session.beverages.rawData.filter(({ salePointId }) => pointsSet.has(salePointId)).slice(0, 8);
  }

  update = () => {
    this.session.beverages.validate();
  };
}

export default LastBeverages;
