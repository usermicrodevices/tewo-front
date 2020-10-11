import { observable, reaction } from 'mobx';

class Speedometr {
  generic;

  session;

  @observable value;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const updateValue = () => session.points.getBeveragesSpeed(settings.salePointsId).then((value) => { this.value = value; });
    reaction(() => this.generic.salePointsId, updateValue);
    updateValue();
  }
}

export default Speedometr;
