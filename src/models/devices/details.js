/* eslint class-methods-use-this: off */
import { computed, observable, reaction } from 'mobx';
import localStorage from 'mobx-localstorage';
import moment from 'moment';

const STORAGE_KEY = '';

class Details {
  @observable waterQuality;

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

    const updateData = () => {
      me.session.devices.getStats(me.id);
      setTimeout(
        () => { this.waterQuality = new Array(Math.round(2 + Math.random() * 12)).fill(null).map(() => Math.random()); },
        2000,
      );
    };
    reaction(() => this.dateRange, updateData);
    updateData();
  }

  @computed get isWaterQualified() {
    return Array.isArray(this.waterQuality);
  }
}

export default Details;
