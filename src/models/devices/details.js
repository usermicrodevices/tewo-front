/* eslint class-methods-use-this: off */
import { computed, observable, reaction } from 'mobx';
import localStorage from 'mobx-localstorage';
import moment from 'moment';

import { isDateRange, stepToPast } from 'utils/date';

const STORAGE_KEY = '';

const reduceArray = (field, source) => source && source.reduce(((cur, val) => cur + val[field]), 0);

class Details {
  @observable waterQuality;

  @observable stats = null;

  @observable periodBeveragesAmount;

  @observable clearancesAmount;

  @observable lastBeverages;

  @observable serviceEvents;

  @observable sales;

  @observable salesPrew;

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
      this.sales = undefined;
      this.salesPrew = undefined;
      me.session.beverages.getBeveragesForDevice(me.id, 1, this.dateRange).then(({ count }) => {
        this.periodBeveragesAmount = count;
      });
      me.session.devices.getSalesChart(me.id, this.dateRange).then((sales) => {
        this.sales = sales;
      });
      if (isDateRange(this.dateRange)) {
        me.session.devices.getSalesChart(me.id, stepToPast(this.dateRange)).then((sales) => {
          this.salesPrew = sales;
        });
      } else {
        this.salesPrew = null;
      }
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

  get salesPrewSum() {
    return reduceArray('sales', this.salesPrew);
  }

  get salesSum() {
    return reduceArray('sales', this.sales);
  }

  get salesGrowth() {
    if (!this.sales || !this.salesPrew) {
      return this.sales && this.salesPrew;
    }
    const { salesPrewSum, salesSum } = this;
    if (salesPrewSum === 0) {
      return 0;
    }
    return (salesSum - salesPrewSum) / salesPrewSum * 100;
  }

  get periodBeveragesAmount() {
    return reduceArray('beverages', this.salesPrew);
  }

  @computed get lastService() {
    if (!Array.isArray(this.serviceEvents)) {
      return undefined;
    }
    if (this.serviceEvents.length === 0) {
      return null;
    }
    return this.serviceEvents[this.serviceEvents.length - 1].closeDate;
  }

  @computed get isWaterQualified() {
    return Array.isArray(this.waterQuality);
  }
}

export default Details;
