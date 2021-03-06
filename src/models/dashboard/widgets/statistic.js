import { observable, computed, reaction } from 'mobx';

import { getBeveragesSalePointsStats } from 'services/beverage';
import { SmallSemanticRanges } from 'utils/date';

class Statistic {
  generic;

  session;

  @observable data = null;

  @computed get value() {
    if (this.data === null) {
      return undefined;
    }
    const { chart } = this;
    let result = 0;
    if (Array.isArray(chart)) {
      for (const b of chart) {
        result += b;
      }
    }
    return result;
  }

  @computed get chart() {
    if (this.data === null) {
      return undefined;
    }
    const entries = Object.values(this.data);
    if (entries.length === 0) {
      return new Array(30).fill(0);
    }
    const result = entries[0].map(({ beverages }) => beverages);
    for (const values of entries.slice(1)) {
      for (const [id, { beverages }] of values.entries()) {
        result[id] += beverages;
      }
    }
    return result;
  }

  @computed get top() {
    if (this.data === null) {
      return undefined;
    }
    const result = {};
    for (const [salePointId, values] of Object.entries(this.data)) {
      const v = {
        beverages: 0,
        sales: 0,
        deviceState: {
          err: 0,
          warn: 0,
          ok: 0,
          grey: 0,
        },
      };
      const { deviceState } = v;
      const devices = this.session.devices.getPointDevices(parseInt(salePointId, 10));
      if (Array.isArray(devices)) {
        for (const device of devices) {
          if (device.status === -1) {
            deviceState.grey += 1;
          } else if (device.status === 0) {
            deviceState.err += 1;
          } else if (device.isNeedTechService) {
            deviceState.warn += 1;
          } else {
            deviceState.ok += 1;
          }
        }
      } else {
        deviceState.grey = undefined;
        deviceState.err = undefined;
        deviceState.warn = undefined;
        deviceState.ok = undefined;
      }
      for (const { beverages, sales } of values) {
        v.beverages += beverages;
        v.sales += sales;
      }
      result[salePointId] = v;
    }
    return result;
  }

  update = () => {
    if (typeof this.generic.salePointsId === 'undefined') {
      return;
    }
    getBeveragesSalePointsStats(
      SmallSemanticRanges.prwHalfAnHour.resolver(),
      60,
      this.generic.salePointsId,
    ).then((result) => { this.data = result; });
  };

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const update = () => {
      this.data = null;
      this.update();
    };
    reaction(() => this.generic.salePointsId, update);
    update();
  }
}

export default Statistic;
