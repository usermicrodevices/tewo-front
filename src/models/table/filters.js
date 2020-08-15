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
  },
  selector: {
    operators: ['in'],
    convertor: (v) => [v.join(',')],
    parser: (v) => v.split(','),
    initialValue: [],
    complement: selectorsComparator,
  },
  text: {
    operators: ['icontains'],
    convertor: (v) => [v],
    parser: (v) => v,
    initialValue: '',
    complement: (lhs, rhs) => (rhs.includes(lhs) ? rhs : null),
  },
  daterange: {
    operators: ['gte', 'lte'],
    convertor: (v) => v.format(),
    parser: (v, id, old) => { const r = [...old]; r[id] = moment(v); return r; },
    initialValue: [null, null],
    complement: rangeComparator,
  },
  costrange: {
    operators: ['gte', 'lte'],
    convertor: (v) => v,
    parser: (v, id, old) => { const r = [...old]; r[id] = v; return r; },
    initialValue: [null, null],
    complement: rangeComparator,
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

  constructor(search, columns) {
    this.columns = columns;
    this.search = search;
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

  @action set search(args) {
    this.data = {};
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

  filterType(columnKey) {
    return this.columns.find((({ key }) => key === columnKey)).filter.type;
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
