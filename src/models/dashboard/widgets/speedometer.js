import {
  observable, reaction, action, computed,
} from 'mobx';

const AVERAGE_DEVICE_SPEED = 30;

class Speedometr {
  generic;

  session;

  @observable value = 0;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    this.updateValue();
    reaction(() => this.generic.salePointsId, this.updateValue);
  }

  @computed get maxSpeed() {
    const selectedDevices = this.generic.devices || this.session.devices.rawData;
    const enabledDevices = selectedDevices.filter((d) => d.isOn);

    return enabledDevices.length * AVERAGE_DEVICE_SPEED;
  }

  @action.bound updateValue() {
    if (typeof this.generic.salePointsId === 'undefined') {
      return;
    }

    this.session.points.getBeveragesSpeed(this.generic.salePointsId || [])
      .then((value) => { this.value = value; });
  }
}

export default Speedometr;
