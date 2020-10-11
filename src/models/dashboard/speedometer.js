import { observable, reaction } from 'mobx';

class Speedometr {
  generic;

  session;

  @observable value;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const updateValue = () => {
      this.value = undefined;
      if (typeof this.generic.salePointsId === 'undefined') {
        return;
      }
      session.points.getBeveragesSpeed(this.generic.salePointsId || []).then((value) => { this.value = value; });
    };
    reaction(() => this.generic.salePointsId, updateValue);
    updateValue();
  }
}

export default Speedometr;
