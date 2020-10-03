import { observable, reaction } from 'mobx';

class Speedometr {
  @observable settings;

  session;

  @observable value;

  constructor(settings, session) {
    this.settings = settings;
    this.session = session;

    const updateValue = () => session.points.getBeveragesSpeed(settings.salePointsId).then((value) => { this.value = value; });
    reaction(() => this.settings.salePointsId, updateValue);
    updateValue();
  }
}

export default Speedometr;
