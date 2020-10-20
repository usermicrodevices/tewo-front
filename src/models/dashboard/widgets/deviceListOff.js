import { computed } from 'mobx';
import moment from 'moment';

class DeviceListOff {
  session;

  generic;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    this.update();
  }

  @computed get isLoaded() {
    return this.session.devices.isLoaded;
  }

  @computed get rows() {
    const pointsSet = this.generic.salePointsId === null ? { has: () => true } : new Set(this.generic.salePointsId);
    return this.session.devices.rawData.filter(({ salePointId, isOn, isInactive }) => !isOn && !isInactive && pointsSet.has(salePointId)).map((e) => ({
      salePoint: e.salePoint,
      deviceName: e.name,
      timeInfo: { openDate: e.stopDate, closeDate: moment() },
      key: e.id,
    }));
  }

  update = () => {
    this.session.devices.validate();
  };
}

export default DeviceListOff;
