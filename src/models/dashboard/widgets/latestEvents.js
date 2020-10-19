import { computed } from 'mobx';

class FavoriteObjects {
  session;

  generic;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    this.update();
  }

  @computed get isLoaded() {
    return this.session.events.isLoaded;
  }

  @computed get rows() {
    const pointsSet = this.generic.salePointsId === null ? { has: () => true } : new Set(this.generic.salePointsId);
    return this.session.events.rawData.filter(({ salePointId }) => pointsSet.has(salePointId)).slice(0, 6).map((e) => ({
      eventName: e.eventName,
      salePoint: e.salePoint,
      timeInfo: { openDate: e.openDate, closeDate: e.closeDate },
    }));
  }

  update = () => {
    this.session.events.validate();
  };
}

export default FavoriteObjects;
