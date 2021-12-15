import {
  action, observable, computed, transaction, autorun, toJS,
} from 'mobx';
import moment from 'moment';
import { isDateRange, momentToArg } from 'utils/date';

const rangeComparator = (lhs, rhs) => {
  if (!isDateRange(rhs) && isDateRange(lhs)) {
    return null;
  }
  if (isDateRange(rhs) && !isDateRange(lhs)) {
    return null;
  }
  const [lBegin, lEnd] = lhs;
  const [rBegin, rEnd] = rhs;
  if (rBegin < lBegin || rEnd > lEnd) {
    return null;
  }
  return rhs;
};

const selectorsComparator = (lhs, rhs) => {
  const result = new Set(lhs);
  for (const itm of rhs) {
    if (!result.delete(itm)) {
      return null;
    }
  }
  return [...result.values()];
};

const DATE_RANGE_TYPE = {
  operators: ['gte', 'lte'],
  convertor: (v) => v.map(momentToArg),
  parser: (v, id, old) => { const r = [...old]; r[id] = moment(v.replace('%2B', '+')); return r; },
  initialValue: [null, null],
  complement: rangeComparator,
  apply: (value, [l, r]) => {
    if (!moment.isMoment(value)) {
      return false;
    }
    if (moment.isMoment(l)) {
      if (value < l) {
        return false;
      }
    }
    if (moment.isMoment(r)) {
      if (value > r) {
        return false;
      }
    }
    return true;
  },
  order: 2,
  isNullValue: (value) => {
    if (!Array.isArray(value) || value.length !== 2) {
      return true;
    }
    const [min, max] = value;
    if (moment.isMoment(min) && moment.isMoment(max)) {
      return max - min <= 0;
    }
    return !((moment.isMoment(min) && max === null) || (moment.isMoment(max) && min === null));
  },
};

const SELECTOR_FILTER_TYPE = {
  operators: ['in'],
  convertor: (v) => [v.join(',')],
  parser: (v) => v.split(',').map((id) => parseInt(id, 10)),
  initialValue: [],
  complement: selectorsComparator,
  apply: (value, selected) => selected.includes(value) || typeof value === 'undefined',
  order: 3,
  isNullValue: (value) => !Array.isArray(value) || value.length === 0,
};

const FILTER_TYPES = {
  checkbox: {
    operators: ['exact'],
    convertor: (v) => [v],
    parser: (v) => v,
    initialValue: false,
    complement: (lhs, rhs) => (lhs === rhs ? rhs : null),
    apply: (value, isChecked) => value === isChecked,
    order: 5,
    isNullValue: (value, filter) => value === filter.passiveValue,
  },
  selector: SELECTOR_FILTER_TYPE,
  salepoints: SELECTOR_FILTER_TYPE,
  tag: SELECTOR_FILTER_TYPE,
  singleselector: {
    operators: ['exact'],
    convertor: (v) => [v],
    parser: parseInt,
    initialValue: null,
    complement: (lhs, rhs) => (lhs === rhs ? rhs : null),
    apply: (value, selected) => selected === value || typeof value === 'undefined',
    order: 3,
    isNullValue: (value) => value === null || (typeof value === 'undefined'),
  },
  text: {
    operators: ['icontains'],
    convertor: (v) => [v],
    parser: (v) => v,
    initialValue: '',
    complement: (lhs, rhs) => (rhs.includes(lhs) ? rhs : null),
    apply: (value, substr) => value.toLowerCase().indexOf(substr.toLowerCase()) >= 0,
    order: 1,
    isNullValue: (value) => typeof value !== 'string' || value === '',
  },
  daterange: DATE_RANGE_TYPE,
  costrange: {
    operators: ['gte', 'lte'],
    convertor: (v) => v,
    parser: (v, id, old) => { const r = [...old]; r[id] = v; return r; },
    initialValue: [null, null],
    complement: rangeComparator,
    apply: (value, [l, r]) => (value >= l && value <= r) || typeof value === 'undefined',
    order: 4,
    isNullValue: (value) => !Array.isArray(value) || (value[0] === null && value[1] === null),
  },
};

class Filters {
  data = observable.map();

  filters;

  isShowSearch = true;

  @observable searchText = '';

  constructor(filters) {
    this.filters = filters || {};

    autorun(() => {
      transaction(() => {
        // проверка, изменяющая зависимые селекторы, если они потеряли смысл
        for (const key of this.data.keys()) {
          const filter = this.filters[key];
          if (filter.type === 'selector') {
            const items = filter.selector(this);
            if (Array.isArray(items)) {
              const selector = new Map(items);
              if (selector.size <= 1) {
                this.data.delete(key);
              } else {
                const checked = this.data.get(key).slice().filter((id) => selector.has(id));
                if (checked.length === 0) {
                  delete this.data.get(key);
                } else if (this.data.get(key).length !== checked.length) {
                  this.data.set(key, checked);
                }
              }
            }
          }
        }
      });
    });
  }

  // Если полученный фильтр строже то возвращает разницу (не строгую) иначе возвращает null
  // не строгую в том смысле, что из rhs может быть вычтено не всё, что в this
  isGreater(rhs) {
    console.assert(rhs.filters === this.filters);
    for (const [key, value] of this.data.entries()) {
      const rhsValue = rhs.data[key];
      if (typeof rhsValue === 'undefined') {
        return false;
      }
      const filterType = this.filterType(key);
      const comp = FILTER_TYPES[filterType].complement(value, rhsValue);
      if (comp === null) {
        return false;
      }
    }
    return true;
  }

  set search(args) {
    transaction(() => {
      this.data.clear();
      if (!args.includes('=')) {
        return;
      }
      for (const arg of args.split('&')) {
        const [elem, value] = arg.split('=');
        const [key, operator] = (() => {
          const m = elem.split('__');
          return [m.slice(0, -1).join('__'), m.slice(-1)[0]];
        })();
        if (key in this.filters) {
          const filterType = this.filterType(key);
          const { operators, initialValue, parser } = FILTER_TYPES[filterType];

          if (!this.data.has(key)) {
            this.data.set(key, initialValue);
          }

          const id = operators.findIndex((op) => op === operator);
          if (id < 0) {
            console.error(`unknown operator type ${operator}. Known operators list: ${operators.join(', ')}`);
          } else {
            const filterValue = parser(value, id, this.data.get(key));
            this.data.set(key, filterValue);
          }
        } else {
          console.error(`unknown filter key ${key}. Known keys: ${Object.keys(this.filters).join(', ')}`);
        }
      }
      for (const [key, value] of this.data.entries()) {
        const filter = this.filters[key];
        const { isNullValue } = FILTER_TYPES[filter.type];
        if (isNullValue(value, filter)) {
          this.data.delete(key);
        }
      }
    });
  }

  // Это ключевой момент в выборе формата фильтра: фильтры хранятся в том виде, в котором их отдают антовские объекты.
  @action set(key, value) {
    const filter = this.filters[key];
    const { isNullValue } = FILTER_TYPES[filter.type];
    if (isNullValue(value, filter)) {
      this.data.delete(key);
    } else {
      this.data.set(key, value);
    }
  }

  @action clear() {
    this.data.clear();
  }

  @computed get predicate() {
    return (data) => {
      if (typeof data === 'undefined') {
        return true;
      }
      if (typeof data.name === 'string') {
        const searchText = this.searchText.toLowerCase();
        if (data.name.toLowerCase().indexOf(searchText) < 0) {
          if (typeof data.serial === 'string') {
            if (data.serial.toLowerCase().indexOf(searchText) < 0) {
              return false;
            }
          } else {
            return false;
          }
        }
      }
      for (const key of this.data.keys()) {
        const filter = this.filters[key];
        if (!filter.apply((d) => FILTER_TYPES[filter.type].apply(d, this.data.get(key)), data)) {
          return false;
        }
      }
      return true;
    };
  }

  filterType(filterKey) {
    const filter = this.filters[filterKey];
    if (typeof filter === 'undefined') {
      console.error(`can't find filter with key ${filterKey}`, this.data);
    }
    return filter.type;
  }

  @computed get search() {
    return this.searchSkip(new Set());
  }

  searchSkip(set) {
    return [...this.data.entries()].filter(([key]) => !set.has(key)).map(([key, value]) => {
      const type = this.filterType(key);
      const { operators, convertor } = FILTER_TYPES[type];
      const adaptedValue = convertor(value);
      console.assert(adaptedValue.length === operators.length);
      return adaptedValue
        .filter((v) => v !== null && v !== '')
        .map((valueDatum, i) => `${key}__${operators[i]}=${typeof valueDatum === 'boolean' ? +valueDatum : valueDatum}`)
        .join('&');
    }).join('&');
  }

  get(key) {
    const { type } = this.filters[key];
    if (this.data.has(key)) {
      return this.data.get(key);
    }
    if (type === 'selector' || type === 'tag' || type === 'salepoints') {
      return [];
    }
    return null;
  }

  @computed get elements() {
    return Object.entries(this.filters).map(([key, value]) => ({ ...value, key })).sort(
      (a, b) => Math.sign(FILTER_TYPES[a.type].order - FILTER_TYPES[b.type].order)
        || a.key.localeCompare(b.key),
    );
  }

  clone() {
    const result = new Filters(this.filters);
    result.searchText = this.filters.searchText;
    result.data = observable.map(Object.entries(JSON.parse(JSON.stringify(toJS(this.data)))));
    for (const [key, value] of result.data.entries()) {
      if (Array.isArray(value) && value.length === 2) {
        const range = value.map((v) => moment(v));
        const [l, r] = range;
        if (l.isValid() && r.isValid()) {
          result.data.set(key, range);
        }
      }
    }
    return result;
  }
}

export { FILTER_TYPES, Filters as default };
