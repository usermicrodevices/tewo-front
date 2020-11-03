import {
  action, computed, observable, reaction,
} from 'mobx';
import moment from 'moment';

import { getBeveragesStats } from 'services/beverage';
import { getClearances } from 'services/events';
import { daterangeToArgs } from 'utils/date';

class ClearancesCalendar {
  @observable beverages = {};

  @observable clearance = {};

  loaded = new Set();

  @observable month;

  session;

  table;

  @computed get isLoading() {
    const [year, month] = [Math.floor(this.month / 12), this.month % 12 + 1];
    const key = `${year}${month >= 10 ? month : `0${month}`}01`;
    return !(key in this.beverages && key in this.clearance);
  }

  static rangeLenght(dateRange) {
    return dateRange[1].dayOfYear() - dateRange[0].dayOfYear() + 1;
  }

  static arrayToMap(values, dateRange) {
    const it = dateRange[0].clone();
    const result = {};
    let i = 0;
    console.assert(ClearancesCalendar.rangeLenght(dateRange) === values.length, `${ClearancesCalendar.rangeLenght(dateRange)} !== ${values.length}`);
    while (it <= dateRange[1]) {
      result[it.format('YYYYMMDD')] = values[i];
      i += 1;
      it.add(1, 'day');
    }
    return result;
  }

  @action setDateFilter(range) {
    this.table.filter.data.set('open_date', range);
  }

  @action setMonth(date) {
    const month = date.month() + date.year() * 12;
    this.month = month;
    const dateRange = [date.clone().startOf('month'), date.clone().endOf('month')];
    const externalFilters = this.table.filter.search.replace(/open_date[\w=\-:%]+/, '').replace(/open_date[\w=\-:%]+/, '').replace(/&[&]+/, '&').replace(/^&$/, '');
    if (this.loaded.has(externalFilters) && this.loaded.has(month)) {
      return;
    }
    if (!this.loaded.has(externalFilters)) {
      this.loaded = new Set();
      this.beverages = {};
      this.clearance = {};
      this.loaded.add(externalFilters);
    }
    this.loaded.add(month);
    getBeveragesStats(
      dateRange,
      externalFilters,
      86400,
    ).then(({ beveragesSeria }) => {
      this.beverages = { ...this.beverages, ...ClearancesCalendar.arrayToMap(beveragesSeria, dateRange) };
    });
    const rangeArg = daterangeToArgs(dateRange, 'open_date');
    getClearances(this.session)(1e4, 0, `${rangeArg}${externalFilters && dateRange ? `&${externalFilters}` : externalFilters}`).then(({ results }) => {
      const destrib = new Array(ClearancesCalendar.rangeLenght(dateRange)).fill(0);
      const begin = dateRange[0].dayOfYear();
      for (const { openDate } of results) {
        destrib[openDate.dayOfYear() - begin] += 1;
      }
      this.clearance = { ...this.clearance, ...ClearancesCalendar.arrayToMap(destrib, dateRange) };
    });
    this.setDateFilter([date.clone().startOf('month'), date.clone().endOf('month')]);
  }

  constructor(table, session) {
    this.session = session;
    this.table = table;
    this.setMonth(moment());
    reaction(() => table.filter.search, () => {
      this.setMonth(moment().year(Math.floor(this.month / 12)).month(this.month % 12));
    });
  }
}

export default ClearancesCalendar;
