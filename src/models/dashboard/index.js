import { action, computed } from 'mobx';
import localStorage from 'mobx-localstorage';

const defaultLayout = [
  {
    i: 'begin_0', x: 0, y: 0, w: 3, h: 2,
  },
  {
    i: 'begin_1', x: 3, y: 0, w: 1, h: 2,
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
      salePoints: null,
      chartDateRange: 'prw30Days',
      numberDateRange: 'prw30Minutes',
    },
    key: 'begin_0',
  },
  {
    title: 'Спидометр наливов',
    widgetType: 'speedometer',
    settings: {
      salePoints: null,
    },
    key: 'begin_1',
  },
  {
    title: 'Простая динамика наливов',
    widgetType: 'dynamic',
    settings: {
      salePoints: null,
      dateRange: 'prw7Days',
    },
    key: 'begin_2',
  },
  {
    title: 'Простая динамика наливов',
    widgetType: 'statuses',
    settings: {
      salePoints: null,
      dateRange: 'curDay',
    },
    key: 'begin_3',
  },
];

class Grid {
  layoutKey;

  constructor(layoutKey) {
    this.layoutKey = layoutKey;
  }

  getLayout(columnsAmount) {
    return localStorage.getItem(`${this.layoutKey}_${columnsAmount}_layout`) || defaultLayout;
  }

  @action setLayout(columnsAmount, layout) {
    return localStorage.setItem(`${this.layoutKey}_${columnsAmount}_layout`, layout);
  }

  @computed get items() {
    const key = `${this.layoutKey}_items`;
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, DEFAULT_ITEMS);
    }
    return localStorage.getItem(key);
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
}

export default Grid;
