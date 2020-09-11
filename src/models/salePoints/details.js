/* eslint class-methods-use-this: "off" */
import { computed, observable, reaction } from 'mobx';
import localStorage from 'mobx-localstorage';
import moment from 'moment';

const STORAGE_KEY = 'salePoints_details_forms_data';

class Details {
  @observable salesTopData = null;

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
      dateRange: dateRange ? dateRange.map((t) => (moment.isMoment(t) ? t : moment(t))) : ['', ''],
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

  constructor(session, myId) {
    this.session = session;

    const updateSalesTop = () => {
      this.salesTopData = null;
      session.points.getSalesTop(myId, this.dateRange).then((top) => {
        this.salesTopData = top.sort((a, b) => Math.sign(b.beverages - a.beverages) || Math.sign(b.drinkId - a.drinkId));
      });
    };
    reaction(() => this.dateRange, updateSalesTop);
    updateSalesTop();
  }
}

export default Details;
