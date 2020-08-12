import { action, observable, computed } from 'mobx';
import moment from 'moment';

class Filters {
  @observable data = {};

  constructor(args, columns) {
    console.log(args);

    for (const arg of args.split('&')) {
      const [elem, value] = arg.split('=');
      const [key, operator] = elem.split('__');
      if (operator === 'icontains') {
        this.data[key] = value;
      }
      if (operator === 'exact') {
        if (value === 'True') {
          this.data[key] = true;
        } else if (value === 'False') {
          this.data[key] = false;
        } else {
          this.data[key] = parseFloat(value);
        }
      }
      if (operator === 'in') {
        this.data[key] = {
          value: value.slice(1, -1).split(','),
        };
      }
      if (operator === 'lte' || operator === 'gte' || operator === 'lt' || operator === 'gt') {
        if (!Array.isArray(this.data[key])) {
          this.data[key] = new Array(2);
        }
      }
      if (operator === 'lte') {
        this.data[key][1] = moment(value);
      }
      if (operator === 'gte') {
        this.data[key][0] = moment(value);
      }
      if (operator === 'lt') {
        this.data[key][1] = parseFloat(value);
      }
      if (operator === 'gt') {
        this.data[key][0] = parseFloat(value);
      }
    }
  }

  @action set(column, value) {
    const type = column.filter.type.toLowerCase();
    if (type === 'selector') {
      this.data[column.key] = { value };
    } else {
      this.data[column.key] = value;
    }
  }

  @action clear() {
    this.data = {};
  }

  @computed get search() {
    return Object.entries(this.data).map(([key, value]) => {
      if (typeof value === 'number') {
        return `${key}__exact=${value}`;
      }
      if (Array.isArray(value)) {
        console.assert(value.length === 2);
        const [min, max] = value;
        console.log(min, max);
        if (moment.isMoment(min)) {
          console.assert(moment.isMoment(max));
          return `${key}__lte=${max.format()}&${key}__gte=${min.format()}`;
        }
        const result = [];
        if (min !== '' && min !== null) {
          result.push(`${key}__gt=${min}`);
        }
        if (max !== '' && max !== null) {
          result.push(`${key}__lt=${max}`);
        }
        return result.join('&');
      }
      if (typeof value === 'boolean') {
        return `${key}__exact=${value ? 'True' : 'False'}`;
      }
      if (typeof value === 'string') {
        return `${key}__icontains=${value}`;
      }
      if (typeof value === 'object') {
        const itms = value.value;
        console.assert(Array.isArray(itms));
        return `${key}__in=[${itms.join(',')}]`;
      }
      console.error(`unknown filter value type ${typeof value} for key ${key}`, value);
      return key;
    }).join('&');
  }

  get(column) {
    const type = column.filter.type.toLowerCase();
    if (column.key in this.data) {
      if (type === 'selector') {
        return this.data[column.key].value;
      }
      return this.data[column.key];
    }
    if (type === 'selector') {
      return [];
    }
    return null;
  }
}

export default Filters;
