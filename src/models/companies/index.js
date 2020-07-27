/* eslint class-methods-use-this: "off" */
import { observable, computed } from 'mobx';
import localStorage from 'mobx-localstorage';

const VISIBLE_COLUMNS_KEY = 'companies_table_visible_columns_settings';
const SORT_KEY = 'companies_table_sort_settings';

const COLUMNS_LIST = {
  id: {
    bydefault: true,
    title: 'ID',
    width: 70,
    sortDefault: true,
    sortDirections: 'descend',
  },
  name: {
    bydefault: true,
    title: 'Название',
    grow: 4,
    sortDirections: 'both',
  },
  location: {
    bydefault: true,
    title: 'Город',
    grow: 2,
    sortDirections: 'both',
  },
  objectsCount: {
    bydefault: true,
    title: 'Кол-во объектов',
    align: 'right',
    width: 120,
    sortDirections: 'both',
  },
  actions: {
    bydefault: false,
    title: 'Действия',
    grow: 2,
  },
  inn: {
    bydefault: false,
    title: 'ИНН',
    grow: 2,
  },
  account: {
    bydefault: false,
    title: 'Реквизиты',
    grow: 2,
  },
};

const columnDatumToAntdColumn = ([key, value]) => ({
  key,
  dataIndex: key,
  ...value,
});

class Companies {
  @observable data = [];

  @observable filter = '';

  allColumns = Object.entries(COLUMNS_LIST).map(columnDatumToAntdColumn);

  constructor(session) {
    this.data = null;
    session.getCompanies()
      .then((companies) => {
        this.data = this.applySort(companies);
      })
      .catch((err) => {
        this.data = err;
      });
  }

  @computed get filteredData() {
    const { filter } = this;
    if (!Array.isArray(this.data)) {
      return this.data;
    }
    return this.data.filter(({ name }) => name.indexOf(filter) >= 0);
  }

  @computed get visibleColumns() {
    return localStorage.getItem(VISIBLE_COLUMNS_KEY)
    || this.allColumns
      .filter(({ bydefault }) => bydefault)
      .map(({ key }) => key);
  }

  @computed get sort() {
    const defaultColumn = this.allColumns.filter(({ sortDefault }) => sortDefault)[0];
    return localStorage.getItem(SORT_KEY)
      || {
        column: defaultColumn.key,
        direction: defaultColumn.sortDirections !== 'ascend' ? 'descend' : 'ascend',
      };
  }

  setSort(key) {
    const currentSort = this.sort;
    if (key === currentSort.column && COLUMNS_LIST[key].sortDirections === 'both') {
      localStorage.setItem(SORT_KEY, {
        column: key,
        direction: currentSort.direction === 'ascend' ? 'descend' : 'ascend',
      });
    } else {
      localStorage.setItem(SORT_KEY, {
        column: key,
        direction: COLUMNS_LIST[key].sortDirections !== 'ascend' ? 'descend' : 'ascend',
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
    return localStorage.setItem(VISIBLE_COLUMNS_KEY, data);
  }

  @computed get columns() {
    return this.visibleColumns.map((key) => columnDatumToAntdColumn([key, COLUMNS_LIST[key]]));
  }

  @computed get isLoaded() {
    return Array.isArray(this.data);
  }

  @computed get isLoading() {
    return this.data === null;
  }
}

export default Companies;
