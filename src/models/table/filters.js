import { action, observable, computed } from 'mobx';
import moment from 'moment';

const rangeComparator = (lhs, rhs) => {
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

const FILTER_TYPES = {
  checkbox: {
    operators: ['exact'],
    convertor: (v) => [v],
    parser: (v) => v,
    initialValue: false,
    complement: (lhs, rhs) => (lhs === rhs ? rhs : null),
    apply: (value, isChecked) => value === isChecked,
  },
  selector: {
    operators: ['in'],
    convertor: (v) => [v.join(',')],
    parser: (v) => v.split(','),
    initialValue: [],
    complement: selectorsComparator,
    apply: (value, selected) => selected.findIndex((i) => i === value) >= 0,
  },
  text: {
    operators: ['icontains'],
    convertor: (v) => [v],
    parser: (v) => v,
    initialValue: '',
    complement: (lhs, rhs) => (rhs.includes(lhs) ? rhs : null),
    apply: (value, substr) => value.indexOf(substr) >= 0,
  },
  daterange: {
    operators: ['gte', 'lte'],
    convertor: (v) => v,
    parser: (v, id, old) => { const r = [...old]; r[id] = moment(v); return r; },
    initialValue: [null, null],
    complement: rangeComparator,
    apply: (value, [l, r]) => value >= l && value <= r,
  },
  costrange: {
    operators: ['gte', 'lte'],
    convertor: (v) => v,
    parser: (v, id, old) => { const r = [...old]; r[id] = v; return r; },
    initialValue: [null, null],
    complement: rangeComparator,
    apply: (value, [l, r]) => value >= l && value <= r,
  },
};

class Filters {
  @observable data = {};

  columns;

  less(rhs) {
    if (this.columnts !== rhs.column) {
      return false;
    }
    return false;
  }

  constructor(columns) {
    this.columns = columns;
  }

  // Если полученный фильтр строже то возвращает разницу (не строгую) иначе возвращает null
  // не строгую в том смысле, что из rhs может быть вычтено не всё, что в this
  complement(rhs) {
    console.assert(rhs.columns === this.columns);
    const result = new Filters(this.columns);
    for (const [key, value] of Object.entries(this.data)) {
      const rhsValue = rhs.data[key];
      if (typeof rhsValue === 'undefined') {
        return null;
      }
      const filterType = this.filterType(key);
      const comp = FILTER_TYPES[filterType].complement(value, rhsValue);
      if (comp === null) {
        return null;
      }
      result.data[key] = comp;
    }
    return result;
  }

  set search(args) {
    this.data = {};
    if (!args.includes('=')) {
      return;
    }
    for (const arg of args.split('&')) {
      const [elem, value] = arg.split('=');
      const [key, operator] = elem.split('__');
      const filterType = this.filterType(key);
      const { operators, initialValue, parser } = FILTER_TYPES[filterType];

      if (!(key in this.data)) {
        this.data[key] = initialValue;
      }

      const id = operators.findIndex((op) => op === operator);
      if (id < 0) {
        console.error(`unknown operator type ${operator}. Known operators list: ${operators.join(', ')}`);
      }
      this.data[key] = parser(value, id, this.data[key]);
    }
  }

  // Это ключевой момент в выборе формата фильтра: фильтры хранятся в том виде, в котором их отдают антовские объекты.
  @action set(column, value) {
    this.data[column.key] = value;
  }

  @action clear() {
    this.data = {};
  }

  @computed get predicate() {
    return (data) => {
      for (const [key, value] of Object.entries(data)) {
        if (key in this.data) {
          const filterTyoe = this.filterType(key);
          if (!FILTER_TYPES[filterTyoe].apply(value, this.data[key])) {
            return false;
          }
        }
      }
      return true;
    };
  }

  filterType(columnKey) {
    const column = this.columns.find((({ key }) => key === columnKey));
    if (typeof column === 'undefined') {
      console.error(`can't find folumn with key ${columnKey}`);
    }
    return column.filter.type;
  }

  @computed get search() {
    return Object.entries(this.data).map(([key, value]) => {
      const type = this.filterType(key);
      const { operators, convertor } = FILTER_TYPES[type];
      const adaptedValue = convertor(value);
      console.assert(adaptedValue.length === operators.length);
      return adaptedValue.map((valueDatum, i) => `${key}__${operators[i]}=${valueDatum}`).join('&');
    }).join('&');
  }

  get(column) {
    const { type } = column.filter;
    if (column.key in this.data) {
      return this.data[column.key];
    }
    if (type === 'selector') {
      return [];
    }
    return null;
  }
}

export { FILTER_TYPES, Filters as default };
