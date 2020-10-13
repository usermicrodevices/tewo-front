import { computed } from 'mobx';

class HeatmapDeviceStatuses {
  generic;

  session;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;
  }

  @computed({ keepAlive: true }) get isLoaded() {
    return this.session.points.isLoaded && this.session.devices.isLoaded;
  }

  @computed({ keepAlive: true }) get chartData() {
    if (!Array.isArray(this.generic.devices)) {
      return [];
    }

    return this.generic.devices
      .map((d) => ({ ...d, state: Math.floor(Math.random() * 3 + 1) })) // TODO remove when state come from server
      .map((d) => ({ name: d.id, value: d.state }))
      .sort((a, b) => a.value - b.value);
  }
}

export default HeatmapDeviceStatuses;
