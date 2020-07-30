/* eslint class-methods-use-this: "off" */
import { computed, observable, action } from 'mobx';
import localStorage from 'mobx-localstorage';
import { table as constants } from 'config';

import AsyncModel from './async';
import StaticModel from './static';

const columnDatumToAntdColumn = ([key, value]) => ({
  key,
  dataIndex: key,
  ...value,
});

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
        if (count > constants.smallDataLimit) {
          this.dataModel = new AsyncModel(partialLoader, count, results, this);
        } else {
          this.dataModel = new StaticModel(partialLoader, count, results, this);
        }
      })
      .catch((err) => {
        this.dataModel = err;
      });

    this.columnsMap = columnsMap;
    this.allColumns = Object.entries(columnsMap).map(columnDatumToAntdColumn);
  }

  @action removeColumn(columnKey) {
    this.allColumns.replace(this.allColumns.filter(({ key }) => key !== columnKey));
    delete this.columnsMap[columnKey];
  }

  @computed get visibleColumns() {
    return localStorage.getItem(this.visibleColumnKey)
    || this.allColumns
      .filter(({ bydefault }) => bydefault)
      .map(({ key }) => key);
  }

  @computed get sort() {
    const defaultColumn = this.allColumns.filter(({ sortDefault }) => sortDefault)[0];
    return localStorage.getItem(this.sortKey)
      || {
        column: defaultColumn.key,
        direction: defaultColumn.sortDirections !== 'ascend' ? 'descend' : 'ascend',
      };
  }

  @action setSort(key) {
    const currentSort = this.sort;
    if (key === currentSort.column && this.columnsMap[key].sortDirections === 'both') {
      localStorage.setItem(this.sortKey, {
        column: key,
        direction: currentSort.direction === 'ascend' ? 'descend' : 'ascend',
      });
    } else {
      localStorage.setItem(this.sortKey, {
        column: key,
        direction: this.columnsMap[key].sortDirections !== 'ascend' ? 'descend' : 'ascend',
      });
    }
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
    return this.visibleColumns.map((key) => columnDatumToAntdColumn([key, this.columnsMap[key]]));
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
}

export default Table;
