import { computed, observable, reaction } from 'mobx';
import { getBeverages } from 'services/beverage';

class LastBeverages {
  session;

  generic;

  @observable beverages;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    reaction(() => this.generic.salePointsId, () => {
      this.beverages = undefined;
      this.update();
    });
    this.update();
  }

  @computed get isLoaded() {
    return typeof this.beverages !== 'undefined';
  }

  @computed get rows() {
    return this.beverages;
  }

  update = () => {
    const { salePointsId } = this.generic;
    if (typeof salePointsId === 'undefined') {
      return;
    }
    getBeverages(this.session)(8, 0, (Array.isArray(salePointsId) && salePointsId.length > 0) ? `device__sale_point__id__in=${salePointsId.join()}` : '')
      .then(({ results }) => {
        this.beverages = results;
      });
  };
}

export default LastBeverages;
