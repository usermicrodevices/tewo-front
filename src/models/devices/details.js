/* eslint class-methods-use-this: off */
import { computed, observable, reaction } from 'mobx';
import moment from 'moment';

import BerevagesStatsPair from 'models/beverages/statsPair';
import DetailsProps from 'models/detailsProps';

const STORAGE_KEY = 'devices_inputs_storage';

class Details {
  @observable waterQuality;

  @observable stats = null;

  @observable clearancesAmount;

  @observable lastBeverages;

  @observable serviceEvents;

  @observable beveragesStats;

  imputsManager = new DetailsProps(STORAGE_KEY);

  @computed get xaxis() {
    const [begin, end] = [moment(), moment().add(this.waterQuality.length, 'day')];
    const result = [];

    const cur = moment(begin);
    while (cur < end) {
      result.push(cur.format('D MMMM'));
      cur.add(1, 'day');
    }
    return result;
  }

  constructor(me) {
    this.me = me;

    const updateDateRelatedData = () => {
      this.waterQuality = undefined;
      this.beveragesStats = new BerevagesStatsPair((daterange) => me.session.devices.getSalesChart(me.id, daterange), this.imputsManager);
    };
    reaction(() => this.dateRange, updateDateRelatedData);
    updateDateRelatedData();
    me.session.devices.getStats(me.id).then((stats) => { this.stats = stats; });
    me.session.beverages.getBeveragesForDevice(me.id, 10).then(({ results }) => {
      this.lastBeverages = results;
    });
    me.session.events.getDeviceServiceEvents(me.id).then(({ results }) => {
      this.serviceEvents = results;
    });
    me.session.events.getDeviceClearancesEventsLastWeek(me.id).then(({ count }) => {
      this.clearancesAmount = count;
    });
  }

  @computed get lastService() {
    if (!Array.isArray(this.serviceEvents)) {
      return undefined;
    }
    if (this.serviceEvents.length === 0) {
      return null;
    }
    return this.serviceEvents[this.serviceEvents.length - 1].openDate;
  }

  @computed get isWaterQualified() {
    return Array.isArray(this.waterQuality);
  }
}

export default Details;
