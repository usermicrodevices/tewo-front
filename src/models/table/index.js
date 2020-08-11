/* eslint class-methods-use-this: "off" */
import { computed, observable, action } from 'mobx';
import localStorage from 'mobx-localstorage';
import { table as constants } from 'config';

import AsyncModel from './async';
import StaticModel from './static';
import Column from './column';

class Table {
  @observable filter = '';

  @observable dataModel = null;

  @observable allColumns;

  @observable columnsMap;

  @observable hoverRow;

  @observable currentRow;

  constructor(partialLoader, columnsMap) {
    partialLoader(constants.preloadLimit)
      .then(({ count, results }) => {
        if (count > constants.smallDataLimit && count !== results.length) {
          this.dataModel = new AsyncModel(partialLoader, count, results, this);
        } else {
          this.dataModel = new StaticModel(partialLoader, count, results, this);
        }
      })
      .catch((err) => {
        this.dataModel = err;
      });

    this.allColumns = Object.entries(columnsMap).map(([key, value]) => new Column(key, value));
    this.columnsMap = {};
    this.allColumns.forEach((v) => {
      this.columnsMap[v.key] = v;
    });
    console.assert(
      this.allColumns.filter(({ isAsyncorder }) => isAsyncorder).length === 1,
      `Таблица ${this.toString()} не получила корректного асинхронного ключа сортировки`,
    );
    console.assert(
      this.allColumns.filter(({ isDefaultSort }) => isDefaultSort).length === 1,
      `Таблица ${this.toString()} не получила ключа сортировки по умолчанию`,
    );
  }

  @action removeColumn(columnKey) {
    this.allColumns.replace(this.allColumns.filter(({ key }) => key !== columnKey));
    delete this.columnsMap[columnKey];
  }

  @computed get visibleColumns() {
    return localStorage.getItem(this.visibleColumnKey)
    || this.allColumns
      .filter(({ isVisbleByDefault }) => isVisbleByDefault)
      .map(({ key }) => key);
  }

  @computed get sort() {
    const sort = localStorage.getItem(this.sortKey);
    if (sort) {
      if (this.isAsync) {
        return {
          ...sort,
          column: this.allColumns.find(({ isAsyncorder }) => isAsyncorder).key,
        };
      }
      return sort;
    }
    if (this.isAsync) {
      return {
        column: this.allColumns.find(({ isAsyncorder }) => isAsyncorder).key,
        direction: 'descend',
      };
    }
    const defaultColumn = this.allColumns.find(({ isDefaultSort }) => isDefaultSort);
    return {
      column: defaultColumn.key,
      direction: defaultColumn.sortDirections !== 'ascend' ? 'descend' : 'ascend',
    };
  }

  @action setSort(column) {
    const currentSort = this.sort;
    localStorage.setItem(this.sortKey, (() => {
      if (this.isAsync || (column === currentSort.column && this.columnsMap[column].sortDirections === 'both')) {
        return {
          column,
          direction: currentSort.direction === 'ascend' ? 'descend' : 'ascend',
        };
      }
      return {
        column,
        direction: this.columnsMap[column].sortDirections !== 'ascend' ? 'descend' : 'ascend',
      };
    })());
  }

  set visibleColumns(data) {
    return localStorage.setItem(this.visibleColumnKey, data);
  }

  @computed get visibleColumnKey() {
    return `${this.toString()}_table_visible_columns_settings`;
  }

  @computed get sortKey() {
    return `${this.toString()}_table_sort_settings`;
  }

  @computed get columns() {
    const keys = new Set(this.visibleColumns);
    const columns = this.allColumns.filter(({ key }) => keys.has(key));
    if (this.isAsync) {
      return columns.map((column) => column.asyncOrder());
    }
    return columns;
  }

  @computed get filterKey() {
    for (const { isForFilter, key } of this.allColumns) {
      if (isForFilter) {
        return key;
      }
    }

    return null;
  }

  @computed get data() {
    if (this.isLoaded) {
      if (this.filter !== '') {
        const { filterKey } = this;
        if (filterKey !== null) {
          return this.dataModel.data.filter((datum) => datum[filterKey].toLowerCase().indexOf(this.filter) >= 0);
        }
      }
      return this.dataModel.data;
    }
    return null;
  }

  @computed get isLoaded() {
    return this.dataModel && this.dataModel.isLoaded;
  }

  @computed get freshItems() {
    if (!this.isLoaded) {
      return 0;
    }
    return this.dataModel.freshItems || 0;
  }

  @computed get isAsync() {
    if (!this.isLoaded) {
      return false;
    }
    return typeof this.dataModel.partialLoader !== 'undefined';
  }

  forceValidate() {
    if (this.isAsync) {
      this.dataModel.forceValidate();
    }
  }

  destruct() {
    if (this.isAsync) {
      this.dataModel.destruct();
    }
  }
}

export default Table;
