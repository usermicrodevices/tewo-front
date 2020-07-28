/* eslint class-methods-use-this: "off" */
import { computed, observable, action } from 'mobx';
import localStorage from 'mobx-localstorage';

const columnDatumToAntdColumn = ([key, value]) => ({
  key,
  dataIndex: key,
  ...value,
});

class Table {
  @observable filter = '';

  @observable data = null;

  @observable allColumns

  @observable columnsMap;

  constructor(columnsMap) {
    this.columnsMap = columnsMap;
    this.allColumns = Object.entries(columnsMap).map(columnDatumToAntdColumn);
  }

  @action removeColumn(columnKey) {
    this.allColumns.replace(this.allColumns.filter(({ key }) => key !== columnKey));
    delete this.columnsMap[columnKey];
  }

  @computed get filteredData() {
    const { filter } = this;
    if (!Array.isArray(this.data)) {
      return this.data;
    }
    return this.data.filter(({ name }) => name.indexOf(filter) >= 0);
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

  setSort(key) {
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
    this.data.replace(this.applySort(this.data.slice()));
  }

  applySort(data) {
    const { column } = this.sort;
    const direction = this.sort.direction === 'descend' ? -1 : 1;
    return data.sort((a, b) => {
      const left = a[column];
      const right = b[column];
      if (left === right) {
        return Math.sign(a.id - b.id);
      }
      return (left > right ? 1 : -1) * direction;
    });
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

  @computed get isLoaded() {
    return Array.isArray(this.data);
  }

  @computed get isLoading() {
    return this.data === null;
  }
}

export default Table;
