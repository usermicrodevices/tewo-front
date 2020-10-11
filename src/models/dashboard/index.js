import {
  action,
  computed,
  observable,
  reaction,
} from 'mobx';
import localStorage from 'mobx-localstorage';

import getDashboardWidgetsInfo from 'services/dashboard';

import Speedometer from './speedometer';
import Statistic from './statistic';
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

    this.items = localStorage.get(LOCAL_STORAGE_DASHBOARD_STATE_KEY) || getDefaultState(session);
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

  @action editNewSettings() {
    let key;
    while ((key = `${Math.random()}`.slice(2)) in this.items);
    this.editingItem = key;
  }

  @computed get widgets() {
    return Object.entries(this.items).map(([uid, { widgetType }]) => ({
      widgetType,
      uid,
      ...this.widgetsInfo[widgetType],
      storage: this.getStorage(uid),
    })).filter(({ storage }) => typeof storage !== 'undefined');
  }

  @action updateSettings(settings) {
    this.items[this.editingItem] = settings;
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
    switch (settings.settings.widgetType) {
      case 'speedometerBeverages': {
        return new Speedometer(settings, this.session);
      }
      case 'overview': {
        return new Statistic(settings, this.session);
      }
      case 'chartBeverages': {
        return new Statistic(settings, this.session);
      }
      case 'heatmapDeviceStatuses': {
        return new Statistic(settings, this.session);
      }
      default:
        console.error(`unknown dashboard storage type ${settings.settings.widgetType}`);
        return undefined;
    }
  }

  @computed get widgetTypeSelector() {
    return Object.entries(this.widgetsInfo).map(([key, { title }]) => [key, title]);
  }
}

export default Grid;
