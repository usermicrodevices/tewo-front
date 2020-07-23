/* eslint class-methods-use-this: "off" */
import { observable, computed } from 'mobx';
import localStorage from 'mobx-localstorage';

const VISIBLE_COLUMNS_KEY = 'companies_table_visible_columns_settings';
const VISIBLE_ROWS_KEY = 'companies_table_visible_crows_settings';

class Companies {
  @observable data;

  constructor(session) {
    this.data = null;
    session.getCompanies()
      .then((companies) => {
        this.data = companies;
      })
      .catch((err) => {
        this.data = err;
      });
  }

  @computed get visibleColumns() {
    return localStorage.getItem(VISIBLE_COLUMNS_KEY) || [
      'id',
      'name',
      'location',
      'objectsCount',
      'actions',
    ];
  }

  set visibleColumns(data) {
    return localStorage.setItem(VISIBLE_COLUMNS_KEY, data);
  }

  @computed get rowsCount() {
    return localStorage.getItem(VISIBLE_ROWS_KEY) || 10;
  }

  set rowsCount(countt) {
    return localStorage.setItem(VISIBLE_ROWS_KEY, countt);
  }

  @computed get isLoaded() {
    return Array.isArray(this.data);
  }

  @computed get isLoading() {
    return this.data === null;
  }
}

export default Companies;
