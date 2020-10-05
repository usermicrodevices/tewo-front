import { action, computed, observable } from 'mobx';
import localStorage from 'mobx-localstorage';

import Speedometer from './speedometer';
import Statistic from './statistic';

const defaultLayout = [
  {
    i: 'begin_0', x: 0, y: 0, w: 3, h: 2,
  },
  {
    i: 'begin_1', x: 3, y: 0, w: 1, h: 2, minH: 1, maxH: 4,
  },
  {
    i: 'begin_2', x: 0, y: 2, w: 2, h: 2,
  },
  {
    i: 'begin_4', x: 2, y: 2, w: 2, h: 2,
  },
];

const DEFAULT_ITEMS = [
  {
    title: 'Живая статистика',
    widgetType: 'overview',
    settings: {
      salePointsId: null,
      chartDateRange: 'prw30Days',
      numberDateRange: 'prw30Minutes',
    },
    key: 'begin_0',
  },
  {
    title: 'Спидометр наливов',
    widgetType: 'speedometer',
    settings: {
      salePointsId: null,
    },
    key: 'begin_1',
  },
  {
    title: 'Простая динамика наливов',
    widgetType: 'dynamic',
    settings: {
      salePointsId: null,
      dateRange: 'prw7Days',
    },
    key: 'begin_2',
  },
  {
    title: 'Простая динамика наливов',
    widgetType: 'statuses',
    settings: {
      salePointsId: null,
      dateRange: 'curDay',
    },
    key: 'begin_3',
  },
];

class Grid {
  layoutKey;

  session;

  storages = new Map();

  @observable editingItem = null;

  constructor(layoutKey, session) {
    this.layoutKey = layoutKey;
    this.session = session;
  }

  getLayout(columnsAmount) {
    return localStorage.getItem(`${this.layoutKey}_${columnsAmount}_layout`) || defaultLayout;
  }

  @action setLayout(columnsAmount, layout) {
    return localStorage.setItem(`${this.layoutKey}_${columnsAmount}_layout`, layout);
  }

  get itemKey() {
    return `${this.layoutKey}_items`;
  }

  @computed get rawItems() {
    const key = this.itemKey;
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, DEFAULT_ITEMS);
    }
    return localStorage.getItem(key);
  }

  @computed get items() {
    return this.rawItems.map((data) => {
      if (!this.storages.has(data.key)) {
        this.storages.set(data.key, this.initStorage(data.widgetType, data.settings));
      }
      return {
        ...data,
        storage: this.storages.get(data.key),
      };
    });
  }

  @action remove({ key: keyToRemove }) {
    localStorage.setItem(this.itemKey, this.rawItems.filter(({ key }) => key !== keyToRemove));
  }

  @computed get itemsCounter() {
    return localStorage.getItem(`${this.layoutKey}_counter`) || 0;
  }

  set itemsCounter(v) {
    return localStorage.setItem(`${this.layoutKey}_counter`, v);
  }

  @action addItem(widgetType, title, settings) {
    this.items.push({
      widgetType,
      title,
      settings,
      key: this.itemsCounter,
    });
    this.itemsCounter += 1;
  }

  initStorage(type, settings) {
    switch (type) {
      case 'speedometer': {
        return new Speedometer(settings, this.session);
      }
      case 'overview': {
        return new Statistic(settings, this.session);
      }
      default:
        console.error(`unknown dashboard storage type ${type}`);
        return {};
    }
  }

  editSettings(item) {
    this.editingItem = item;
  }

  updateSettings(settings) {
    this.cancelEditSettings();
  }

  cancelEditSettings() {
    this.editingItem = null;
  }
}

export default Grid;
