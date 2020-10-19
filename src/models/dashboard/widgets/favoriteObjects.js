import { computed, observable, reaction } from 'mobx';

import { getBeveragesSalePointsStats } from 'services/beverage';

class FavoriteObjects {
  @observable data;

  session;

  generic;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    reaction(() => [this.generic.salePointsId, this.generic.dateRange], () => {
      this.data = undefined;
      this.update();
    });
    this.update();
  }

  @computed get isLoaded() {
    return typeof this.data !== 'undefined';
  }

  @computed get rows() {
    if (this.data === null) {
      return undefined;
    }
    const result = {};
    for (const [salePointId, values] of Object.entries(this.data)) {
      let v = 0;
      for (const { beverages } of values) {
        v += beverages;
      }
      result[salePointId] = v;
    }
    const resolver = {};
    if (this.session.points.isLoaded) {
      const points = this.generic.salePoints || this.session.points.rawData;
      if (typeof points !== 'undefined') {
        for (const point of points) {
          resolver[point.id] = point;
        }
      }
    }
    return Object.entries(result).map(([salePointId, beverages]) => ({
      beverages,
      key: salePointId,
      label: resolver[salePointId] || {
        stateColor: 'rgba(0,0,0,0)', name: undefined,
      },
    }));
  }

  update = () => {
    getBeveragesSalePointsStats(
      this.generic.dateRange,
      86400,
      this.generic.salePointsId,
    ).then((result) => { this.data = result; });
  };
}

export default FavoriteObjects;
