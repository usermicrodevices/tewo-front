import checkData from 'utils/dataCheck';
import { FILTER_TYPES } from 'models/filters';

class Column {
  key;

  isVisibleByDefault;

  title;

  width;

  sortDirections;

  align;

  isAsyncorder;

  transform;

  filterType;

  isDefaultSort;

  constructor(key, data) {
    const mustBe = {
      title: 'string',
    };
    const mayBe = {
      width: 'number',
      grow: 'number',
      align: 'string',
      isVisibleByDefault: 'boolean',
      sortDirections: 'string',
      isAsyncorder: 'boolean',
      transform: 'function',
      filter: 'object',
      isDefaultSort: 'boolean',
    };
    const additionalCheck = {
      sortDirections: (d) => {
        if (['both', 'descend', 'ascend'].findIndex((v) => v === d.toLowerCase()) < 0) {
          console.error(`Для колонки ${data.title} задан некорректный тип сортировки ${d}`);
          return false;
        }
        return true;
      },
      align: (d) => {
        if (['left', 'right', 'center'].findIndex((v) => v === d.toLowerCase()) < 0) {
          console.error(`Для колонки ${data.title} задано некоректное значение align ${d}`);
          return false;
        }
        return true;
      },
      filter: (f) => checkData(
        f,
        {
          type: 'string',
          title: 'string',
        },
        {
          selector: 'object',
          resolver: 'any',
        },
        {
          type: (t) => {
            if (!(t.toLowerCase() in FILTER_TYPES)) {
              console.error(`Для колонки ${data.title} задан некорректный тип фильтра ${t}`);
              return false;
            }
            return true;
          },
          resolver: (r) => {
            if (r !== null && typeof r !== 'object') {
              console.error(`Для колонки ${data.title} задан некорректный ресолвер фильтра ${typeof r}`);
              return false;
            }
            return true;
          },
        },
      ),
    };

    checkData(data, mustBe, mayBe, additionalCheck);

    this.width = (() => {
      if (typeof data.grow === 'undefined') {
        if (typeof data.width !== 'number') {
          console.error(`Для колонки ${data.title} не задано значение ширины`);
          return { grow: 1 };
        }
        if (data.width < 50 || data.width > 300) {
          console.error(`Для колонки ${data.title} задано некорректное значение ширины`);
          return { grow: 1 };
        }
        return { width: data.width };
      }
      if (typeof data.width === 'undefined') {
        if (typeof data.grow !== 'number') {
          console.error(`Для колонки ${data.title} не задано значение ширины`);
          return { grow: 1 };
        }
        if (data.grow <= 0) {
          console.error(`Для колонки ${data.title} задано некорректное значение ширины`);
          return { grow: 1 };
        }
        return { grow: data.grow };
      }
      console.error(`Для колонки ${data.title} задано и фиксированное и относительное значение ширины, относительное проигнорировано`);
      return { width: data.width };
    })();

    this.key = key;
    this.title = data.title;
    this.isVisibleByDefault = data.isVisibleByDefault || false;
    this.sortDirections = data.sortDirections || null;
    this.isAsyncorder = data.isAsyncorder || false;
    this.transform = data.transform || ((v) => v);
    this.filter = data.filter || null;
    if (this.filter) {
      this.filter.type = this.filter.type.toLowerCase();
    }
    this.isDefaultSort = data.isDefaultSort || false;
  }

  asyncOrder() {
    return {
      ...this,
      sortDirections: this.isAsyncorder ? 'both' : null,
    };
  }
}

export default Column;
