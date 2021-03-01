import {
  computed, observable, action, reaction,
} from 'mobx';

const generateLegend = (maxCleanings = 100) => [
  {
    from: 0,
    to: 0,
    name: 'Без очисток',
    color: 'black',
  },
  {
    from: 1,
    to: maxCleanings,
    name: 'С очистками',
    color: '#2979BD',
  },
];

class HeatmapClearances {
  generic;

  session;

  @observable selected = null;

  @observable cleanings = null;

  @computed get legend() {
    return generateLegend(this.chartData.length ? this.chartData[this.chartData.length - 1].value : 0);
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    this.updateValue();
    reaction(() => [this.generic.salePointsId, this.generic.dateRange], this.updateValue);
  }

  @action.bound updateValue() {
    this.session.devices.getCleaningsCount(this.generic.dateRange)
      .then((cleanings) => {
        this.cleanings = cleanings;
      });
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
    if (!Array.isArray(this.generic.devices) || !this.cleanings) {
      return [];
    }

    return this.generic.devices
      .map((d) => ({ id: d.id, name: d.name, value: this.cleanings[d.id] || 0 }))
      .sort((a, b) => a.value - b.value);
  }
}

export default HeatmapClearances;
