import Column from './column';

class SimpleTableModel {
  rows;

  isHideTitleRow = true;

  columnsData;

  set columns(columnsMap) {
    this.columnsData = Object.entries(columnsMap)
      .map(([key, value]) => new Column(key, value));
  }

  get columns() {
    return this.columnsData;
  }

  actions = {};

  sort = { column: null, direction: 'ascend' };

  get data() {
    return this.rows;
  }

  newElements = { has: () => false };

  get isLoaded() {
    return Array.isArray(this.data);
  }

  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
  }
}

export default SimpleTableModel;
