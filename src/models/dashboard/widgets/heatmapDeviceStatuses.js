import { computed, observable, action } from 'mobx';

const getStateForDevice = (device) => {
  if (device.isInactive) {
    return 4;
  }

  if (!device.isOn) {
    return 3;
  }

  if (device.isNeedTechService || device.isHasOverlocPPM || device.isHaveOverdueTasks) {
    return 2;
  }

  return 1;
};

class HeatmapDeviceStatuses {
  generic;

  session;

  @observable selected = null;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;
  }

  @action.bound setSelected(id) {
    this.selected = id;
  }

  @computed get isSelectedVisible() {
    return Boolean(this.selected);
  }

  @computed({ keepAlive: true }) get selectedDevice() {
    const device = this.session.devices.get(this.selected);

    return device;
  }

  @computed({ keepAlive: true }) get isLoaded() {
    return this.session.points.isLoaded && this.session.devices.isLoaded;
  }

  @computed({ keepAlive: true }) get chartData() {
    if (!Array.isArray(this.generic.devices)) {
      return [];
    }

    return this.generic.devices
      .map((d) => ({ ...d, state: getStateForDevice(d) })) // TODO remove when state come from server
      .map((d) => ({ id: d.id, name: d.name, value: d.state }))
      .sort((a, b) => a.value - b.value);
  }
}

export default HeatmapDeviceStatuses;
