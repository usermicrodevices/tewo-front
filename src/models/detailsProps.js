import { computed } from 'mobx';
import localStorage from 'mobx-localstorage';
import moment from 'moment';

const DEFAULT_DATE_RANGE = [moment().subtract(1, 'week').startOf('day'), moment().endOf('day')];

const SALES_DATA_TYPES = [
  {
    value: 'beveragesSeriaCur',
    label: 'Наливы за текущий период',
    axis: 0,
  },
  {
    value: 'beveragesSeriaPrw',
    label: 'Наливы за прошлый период',
    axis: 0,
  },
  {
    value: 'salesSeriaCur',
    label: 'Продажи за текущий период',
    axis: 1,
  },
  {
    value: 'salesSeriaPrw',
    label: 'Продажи за прошлый период',
    axis: 1,
  },
];

const DEFAUL_CURVES = SALES_DATA_TYPES.filter(({ axis }) => axis).map(({ value }) => value);

class DetailsProps {
  storageKey;

  @computed get dateRange() {
    return (localStorage.getItem(`${this.storageKey}_date`) || DEFAULT_DATE_RANGE).map((t) => (moment.isMoment(t) || t === '' ? t : moment(t)));
  }

  set dateRange(dateRange) {
    localStorage.setItem(`${this.storageKey}_date`, (() => {
      if (Array.isArray(dateRange) && dateRange.length === 2 && moment.isMoment(dateRange[0]) && moment.isMoment(dateRange[1])) {
        return [
          dateRange[0].startOf('day'),
          dateRange[1].endOf('day'),
        ];
      }
      return DEFAULT_DATE_RANGE;
    })());
  }

  @computed get visibleCurves() {
    return localStorage.getItem(`${this.storageKey}_chart`) || DEFAUL_CURVES;
  }

  set visibleCurves(charts) {
    localStorage.setItem(`${this.storageKey}_chart`, charts);
  }

  constructor(storageKey) {
    this.storageKey = storageKey;
  }
}

export { DetailsProps as default, SALES_DATA_TYPES };
