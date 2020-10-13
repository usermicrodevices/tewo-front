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

  @computed({ keepAlive: true }) get devices() {
    return this.session.devices.rawData.toJSON()
      .map((d) => ({ ...d, state: Math.floor(Math.random() * 3 + 1) }))
      .map((d) => ({ name: d.id, value: d.state }));
  }
}

export default HeatmapDeviceStatuses;
