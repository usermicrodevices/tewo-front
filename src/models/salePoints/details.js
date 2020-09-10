/* eslint class-methods-use-this: "off" */
import { computed } from 'mobx';
import localStorage from 'mobx-localstorage';
import moment from 'moment';

const STORAGE_KEY = 'salePoints_details_forms_data';

class Details {
  performanceData;

  session;

  @computed get sorageData() {
    return localStorage.getItem(STORAGE_KEY) || {
      dateRange: ['', ''],
      charts: [],
    };
  }

  set sorageData(v) {
    localStorage.setItem(STORAGE_KEY, v);
  }

  @computed get dateRange() {
    return this.sorageData.dateRange.map((t) => (moment.isMoment(t) || t === '' ? t : moment(t)));
  }

  set dateRange(dateRange) {
    this.sorageData = {
      ...this.sorageData,
      dateRange: dateRange.map((t) => (moment.isMoment(t) ? t : moment(t))),
    };
  }

  @computed get visibleCurves() {
    return this.sorageData.charts;
  }

  set visibleCurves(charts) {
    this.sorageData = {
      ...this.sorageData,
      charts,
    };
  }

  constructor(session) {
    this.session = session;
  }
}

export default Details;
