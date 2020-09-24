/* eslint class-methods-use-this: off */
import { computed, observable, reaction } from 'mobx';

import { devices as deviceRout } from 'routes';
import BeveragesStatsPair from 'models/beverages/statsPair';
import DetailsProps from 'models/detailsProps';

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

class Details {
  @observable salesTopData = null;

  @observable beveragesStats;

  @observable outdatedTasksAmount;

  id;

  session;

  devicesPath = deviceRout.path;

  imputsManager = new DetailsProps(STORAGE_KEY);

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

  @computed get devices() {
    return this.me.devices;
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
    return this.devices.filter(({ isNeedTechService }) => isNeedTechService).length;
  }

  @computed get devicesHardWaterAmount() {
    const { devices } = this;
    if (!Array.isArray(devices)) {
      return undefined;
    }
    return this.devices.filter(({ isHasOverlocPPM }) => isHasOverlocPPM).length;
  }

  @computed get downtime() {
    let sum = 0;
    if (!Array.isArray(this.devices)) {
      return this.devices;
    }
    for (const { downtime } of this.devices) {
      sum += downtime;
    }
    return sum;
  }

  @computed get offDevicesAmount() {
    const { devices } = this;
    if (!devices) {
      return devices;
    }
    return devices.filter((device) => !device.isOn).length;
  }

  constructor(session, me) {
    this.session = session;
    const myId = me.id;
    this.me = me;

    const updateSalesTop = () => {
      this.salesTopData = null;

      session.points.getSalesTop(myId, this.imputsManager.dateRange).then((top) => {
        this.salesTopData = top.sort((a, b) => Math.sign(b.beverages - a.beverages) || Math.sign(b.drinkId - a.drinkId));
      });

      this.beveragesStats = new BeveragesStatsPair((date) => session.points.getSalesChart(myId, date), this.imputsManager);
    };
    reaction(() => this.imputsManager.dateRange, updateSalesTop);
    updateSalesTop();
    session.points.getOutdatedTasks(myId).then((count) => { this.outdatedTasksAmount = count; });
  }
}

export { CURVE_TYPES, Details as default };
