/* eslint class-methods-use-this: off */
import { computed, observable, reaction } from 'mobx';
import localStorage from 'mobx-localstorage';
import moment from 'moment';

import { devices as deviceRout } from 'routes';
import { isDateRange, stepToPast } from 'utils/date';

const STORAGE_KEY = 'salePoints_details_forms_data';

const CURVE_TYPES = [
  {
    value: 'beveragesSeriaCur',
    label: 'Наливы за текущий период',
  },
  {
    value: 'beveragesSeriaPrv',
    label: 'Наливы за прошлый период',
  },
  {
    value: 'salesSeriaCur',
    label: 'Продажи за текущий период',
  },
  {
    value: 'salesSeriaPrv',
    label: 'Продажи за прошлый период',
  },
];

const reduce = (d, field) => {
  if (!Array.isArray(d)) {
    return undefined;
  }
  return d.reduce((a, b) => a + b[field], 0);
};

const mapToSeria = (data, field) => {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.map((d) => d[field]);
};

class Details {
  @observable salesTopData = null;

  @observable chartData = null;

  @observable prewChartData = null;

  @observable outdatedTasks;

  id;

  session;

  devicesPath = deviceRout.path;

  @computed get isSeriesLoaded() {
    return Array.isArray(this.chartData);
  }

  @computed get series() {
    const visibleCurves = new Set(this.visibleCurves);
    const series = CURVE_TYPES.filter(({ value }) => visibleCurves.has(value) && this[value] !== null);
    return series.map(({ label, value }) => ({ data: this[value], name: label }));
  }

  @computed get xSeria() {
    if (!Array.isArray(this.chartData)) {
      return null;
    }
    return this.chartData.map(({ day }) => day);
  }

  @computed get beveragesSeriaCur() {
    return mapToSeria(this.chartData, 'beverages');
  }

  @computed get beveragesSeriaPrv() {
    return mapToSeria(this.prewChartData, 'beverages');
  }

  @computed get salesSeriaCur() {
    return mapToSeria(this.chartData, 'sales');
  }

  @computed get salesSeriaPrv() {
    return mapToSeria(this.prewChartData, 'sales');
  }

  @computed get dateRange() {
    return (localStorage.getItem(`${STORAGE_KEY}_date`) || ['', '']).map((t) => (moment.isMoment(t) || t === '' ? t : moment(t)));
  }

  set dateRange(dateRange) {
    localStorage.setItem(`${STORAGE_KEY}_date`, (() => {
      if (Array.isArray(dateRange) && dateRange.length === 2 && moment.isMoment(dateRange[0]) && moment.isMoment(dateRange[1])) {
        return [
          dateRange[0].startOf('day'),
          dateRange[1].endOf('day'),
        ];
      }
      return ['', ''];
    })());
  }

  @computed get visibleCurves() {
    return (localStorage.getItem(`${STORAGE_KEY}_chart`) || CURVE_TYPES.map(({ value }) => value));
  }

  set visibleCurves(charts) {
    localStorage.setItem(`${STORAGE_KEY}_chart`, charts);
  }

  @computed get salesTop() {
    if (!Array.isArray(this.salesTopData)) {
      return this.salesTopData;
    }
    return this.salesTopData.map((data) => {
      const drink = this.session.drinks.get(data.drinkId);
      const drinkName = drink ? drink.name : drink;
      return { drinkName, ...data };
    });
  }

  @computed get curSales() {
    return reduce(this.chartData, 'sales');
  }

  @computed get prwSales() {
    if (this.chartData && this.prewChartData === null) {
      return null;
    }
    return reduce(this.prewChartData, 'sales');
  }

  @computed get curBeverages() {
    return reduce(this.chartData, 'beverages');
  }

  @computed get prwBeverages() {
    if (this.chartData && this.prewChartData === null) {
      return null;
    }
    return reduce(this.prewChartData, 'beverages');
  }

  diffPercents(field) {
    if (this.chartData === null) {
      return undefined;
    }
    if (this.prewChartData === null) {
      return 0;
    }
    const cur = this[`cur${field}`];
    const prw = this[`prw${field}`];
    if (prw === 0) {
      return 0;
    }
    return (cur - prw) / prw * 100;
  }

  @computed get salesDiff() {
    return this.diffPercents('Sales');
  }

  @computed get beveragesDiff() {
    return this.diffPercents('Beverages');
  }

  @computed get devices() {
    return this.session.devices.getPointDevices(this.id);
  }

  @computed get devicesAmount() {
    const { devices } = this;
    if (!Array.isArray(devices)) {
      return undefined;
    }
    return this.devices.length;
  }

  @computed get devicesServceRequiredAmount() {
    const { devices } = this;
    if (!Array.isArray(devices)) {
      return undefined;
    }
    return undefined;// this.devices.filter(({ isServiceRequired }) => isDisabled).length;
  }

  @computed get devicesHardWaterAmount() {
    const { devices } = this;
    if (!Array.isArray(devices)) {
      return undefined;
    }
    return undefined;// this.devices.filter(({ isHardWater }) => isDisabled).length;
  }

  @computed get downtime() {
    return reduce(this.devices, 'downtime');
  }

  @computed get offDevicesAmount() {
    const { devices } = this;
    if (!devices) {
      return devices;
    }
    return devices.filter((device) => !device.isOn).length;
  }

  constructor(session, myId) {
    this.session = session;
    this.id = myId;

    const updateSalesTop = () => {
      this.salesTopData = null;
      this.prewChartData = null;
      this.chartData = null;

      session.points.getSalesTop(myId, this.dateRange).then((top) => {
        this.salesTopData = top.sort((a, b) => Math.sign(b.beverages - a.beverages) || Math.sign(b.drinkId - a.drinkId));
      });

      session.points.getSalesChart(myId, this.dateRange).then((sales) => {
        this.chartData = sales;
      });

      if (isDateRange(this.dateRange)) {
        session.points.getSalesChart(myId, stepToPast(this.dateRange)).then((sales) => {
          this.prewChartData = sales;
        });
      }
    };
    reaction(() => this.dateRange, updateSalesTop);
    updateSalesTop();
    session.points.getOutdatedTasks(myId).then((count) => { this.outdatedTasks = count; });
  }
}

export { CURVE_TYPES, Details as default };
