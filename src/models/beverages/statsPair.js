import { observable, computed } from 'mobx';

import { isDateRange, stepToPast } from 'utils/date';
import { SALES_DATA_TYPES } from 'models/detailsProps';

class BeveragesStatsPair {
  @observable cur;

  @observable prw;

  props;

  constructor(requester, props) {
    requester(props.dateRange).then((sales) => {
      this.cur = sales;
    });

    if (isDateRange(props.dateRange)) {
      requester(stepToPast(props.dateRange)).then((sales) => {
        this.prw = sales;
      });
    }

    this.props = props;
  }

  @computed get beveragesSeriaCur() {
    return this.cur && this.cur.beveragesSeria;
  }

  @computed get beveragesSeriaPrw() {
    return this.prw && this.prw.beveragesSeria;
  }

  @computed get salesSeriaCur() {
    return this.cur && this.cur.salesSeria;
  }

  @computed get salesSeriaPrw() {
    return this.prw && this.prw.salesSeria;
  }

  @computed get salesCur() {
    return this.cur && this.cur.sales;
  }

  @computed get salesPrw() {
    if (this.isSeriesLoaded && !this.prw) {
      return null;
    }
    return this.prw && this.prw.sales;
  }

  @computed get beveragesCur() {
    return this.cur && this.cur.beverages;
  }

  @computed get beveragesPrw() {
    if (this.isSeriesLoaded && !this.prw) {
      return null;
    }
    return this.prw && this.prw.beverages;
  }

  diffPercents(field) {
    if (!this.isSeriesLoaded) {
      return undefined;
    }
    if (!this.prw) {
      return 0;
    }
    const cur = this[`${field}Cur`];
    const prw = this[`${field}Prw`];
    if (prw === 0) {
      return 0;
    }
    return (cur - prw) / prw * 100;
  }

  @computed get salesDiff() {
    return this.diffPercents('sales');
  }

  @computed get beveragesDiff() {
    return this.diffPercents('beverages');
  }

  @computed get isSeriesLoaded() {
    return !!this.cur;
  }

  @computed get series() {
    const visibleCurves = new Set(this.props.visibleCurves);
    const series = SALES_DATA_TYPES.filter(({ value }) => visibleCurves.has(value) && typeof this[value] !== 'undefined');
    return series.map(({ label, value, axis }) => ({ data: this[value], name: label, axis }));
  }

  @computed get xSeria() {
    if (!this.isSeriesLoaded) {
      return null;
    }
    return this.cur.data.map(({ day }) => day);
  }
}

export default BeveragesStatsPair;
