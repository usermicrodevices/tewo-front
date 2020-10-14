import {
  action,
  computed,
  observable,
} from 'mobx';
import localStorage from 'mobx-localstorage';

import getDashboardWidgetsInfo from 'services/dashboard';

import Speedometer from './widgets/speedometer';
import Statistic from './widgets/statistic';
import ChartBeveragesSales from './widgets/chartBeveragesSales';
import DiagramTechState from './widgets/diagramTechState';
import DiagramPopularity from './widgets/diagramPopularity';
import DiagramSalePointsBeveragesRate from './widgets/diagramSalePointsBeveragesRate';
import getDefaultState from './utils';
import Settings from './settings';

const LOCAL_STORAGE_DASHBOARD_STATE_KEY = 'LOCAL_STORAGE_DASHBOARD_TEMPRORATY_STATE_KEY';

class Grid {
  layoutKey;

  session;

  @observable widgetsInfo = {};

  @computed get isWidgetsInfoLoaded() { return Object.entries(this.widgetsInfo).length > 0; }

  @observable items;

  @observable editingItem = null;

  @computed get isEdditingNewItem() { return this.isEdditing && !(this.editingItem in this.items); }

  @computed get isEdditing() { return this.editingItem !== null; }

  storages = new Map();

  constructor(layoutKey, session) {
    this.layoutKey = layoutKey;
    this.session = session;

    getDashboardWidgetsInfo().then((typesInfo) => { this.widgetsInfo = typesInfo; });

    this.items = (localStorage.get(LOCAL_STORAGE_DASHBOARD_STATE_KEY) || getDefaultState(session));
    for (const [key, itm] of Object.entries(this.items)) {
      this.items[key] = observable.map(Object.entries(itm));
    }
  }

  getLayout(columnsAmount) {
    return localStorage.getItem(`${this.layoutKey}_${columnsAmount}_layout`);
  }

  @action setLayout(columnsAmount, layout) {
    return localStorage.setItem(`${this.layoutKey}_${columnsAmount}_layout`, layout);
  }

  @action remove(key) {
    delete this.items[key];
    localStorage.set(LOCAL_STORAGE_DASHBOARD_STATE_KEY, this.items);
  }

  @action editSettings(itemKey) {
    this.editingItem = itemKey;
  }

  @action setDateRangeGlobal(range) {
    for (const settings of Object.values(this.items)) {
      settings.set('dateFilter', range);
    }
    localStorage.set(LOCAL_STORAGE_DASHBOARD_STATE_KEY, this.items);
  }

  @action setDateRange(range, itemKey) {
    this.items[itemKey].set('dateFilter', range);
    localStorage.set(LOCAL_STORAGE_DASHBOARD_STATE_KEY, this.items);
  }

  @action editNewSettings() {
    let key;
    while ((key = `${Math.random()}`.slice(2)) in this.items);
    this.editingItem = key;
  }

  @computed get widgets() {
    return Object.entries(this.items).map(([uid, settings]) => ({
      widgetType: settings.get('widgetType'),
      uid,
      ...this.widgetsInfo[settings.get('widgetType')],
      storage: this.getStorage(uid),
    })).filter(({ storage }) => typeof storage !== 'undefined');
  }

  @action updateSettings(settings) {
    if (this.editingItem in this.items) {
      this.items[this.editingItem].replace(settings);
    } else {
      this.items[this.editingItem] = observable.map(Object.entries(settings));
    }
    localStorage.set(LOCAL_STORAGE_DASHBOARD_STATE_KEY, this.items);
    this.cancelEditSettings();
  }

  @action cancelEditSettings() {
    this.editingItem = null;
  }

  getStorage(uid) {
    if (!this.storages.has(uid)) {
      const item = this.items[uid];
      this.storages.set(uid, this.initStorage(new Settings(item, this.session)));
    }
    return this.storages.get(uid);
  }

  initStorage(settings) {
    switch (settings.settings.get('widgetType')) {
      case 'speedometerBeverages':
        return new Speedometer(settings, this.session);
      case 'overview':
        return new Statistic(settings, this.session);
      case 'chartBeverages':
        return new Statistic(settings, this.session);
      case 'heatmapDeviceStatuses':
        return new Statistic(settings, this.session);
      case 'chartBeveragesSales':
        return new ChartBeveragesSales(settings, this.session);
      case 'diagramTechState':
        return new DiagramTechState(settings, this.session);
      case 'diagramPopularity':
        return new DiagramPopularity(settings, this.session);
      case 'diagramSalePointsBeveragesRate':
        return new DiagramSalePointsBeveragesRate(settings, this.session);
      default:
        console.error(`unknown dashboard storage type ${settings.settings.get('widgetType')}`);
        return undefined;
    }
  }

  @computed get widgetTypeSelector() {
    return Object.entries(this.widgetsInfo).map(([key, { title }]) => [key, title]);
  }
}

export default Grid;
