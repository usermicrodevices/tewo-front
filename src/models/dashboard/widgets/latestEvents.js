import { computed } from 'mobx';

class LastEvents {
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

    return this.session.events.rawData
      .filter((event) => event) // Временный фикс. Требуется найти причину почему в массиве rawData есть undefined TW-442
      .filter(({ salePointId }) => pointsSet.has(salePointId)).slice(0, 6).map((e) => ({
        eventName: e.eventName,
        key: e.id,
        salePoint: e.salePoint,
        timeInfo: { openDate: e.openDate, closeDate: e.closeDate },
      }));
  }

  update = () => {
    this.session.events.validate();
  };
}

export default LastEvents;
