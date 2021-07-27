/* eslint class-methods-use-this: off */
import {
  computed, observable, action, reaction,
} from 'mobx';
import localStorage from 'mobx-localstorage';
import { table as constants } from 'config';

import Keeper from './keeper';
import Column from './column';

/**
 * Модель таблицы объединяет две абстракции: данные и колонки.
 * Columns - простое описание столбцов таблицы. Типа отображаемых данных,
 * доступных сортировок, возможности фильтровать данные по данному стобцу,
 * очерёдности отображения столбцов
 * dataModel - объект, управляющий кешем данных. Данные запрашиваются с
 * сервера асинхронно. Модель может находится в трёх состояниях:
 * статическом, динамическом и состоянии инициализации. При этом состояние
 * инициализации не выделено флагом а моделируется пустой статической таблицей.
 * Модели не должны содержать интервалов так как не знают времени своего
 * уничтожения. Модель предоставляет методы для обновления данных но не
 * запускает их. Это ответственность Page.
 */

// Сколько строк максимум может быть видно
const MAX_VISIBLE_ROWS_AMOUNT = 100;
// Сколько строк закружарть выше видимой области
const UP_ROWS_STOCK = Math.floor((constants.preloadLimit - MAX_VISIBLE_ROWS_AMOUNT) / 2);
// Сколько подождать после изменения currentRow, чтобы начать дозагрузку
const NEW_CHANGES_WAIT_DELAY = 300;

class Table {
  @observable dataModel;

  @observable allColumns;

  openedRows = observable.set();

  // Верхняя строчка скролла
  @observable currentRow;

  actions = {};

  constructor(columnsMap, loader, filter) {
    console.assert(typeof loader === 'function', `не получен лоадер для таблицы ${this.toString()}`);
    console.assert(typeof filter !== 'undefined', `Не передан фильтер для таблицы ${this.toString()}`);
    console.assert(this.toString() !== '[object Object]', 'Не реализован метод toString для наследника Table');
    this.allColumns = Object.entries(columnsMap)
      .map(([key, value]) => new Column(key, value))
      .sort(this.columnsSortPredicate(columnsMap));
    console.assert(
      this.allColumns.filter(({ isAsyncorder }) => isAsyncorder).length === 1 || this.isImpossibleToBeAsync,
      `Таблица ${this.toString()} не получила корректного асинхронного ключа сортировки`,
    );
    console.assert(
      this.allColumns.filter(({ isDefaultSort }) => isDefaultSort).length === 1,
      `Таблица ${this.toString()} не получила ключа сортировки по умолчанию`,
    );
    this.dataModel = new Keeper(filter, loader, this.isImpossibleToBeAsync, this.isImpossibleToBeSync);

    reaction(() => this.currentRow, (scrollEventMomentRow) => {
      setTimeout(() => {
        if (this.currentRow === scrollEventMomentRow) {
          this.performVisibleDataValidation();
        }
      }, NEW_CHANGES_WAIT_DELAY);
    });

    reaction(() => this.sort.direction, () => {
      this.performVisibleDataValidation();
    });

    reaction(() => this.sort, this.performVisibleDataValidation);
  }

  get filter() {
    return this.dataModel.filter;
  }

  @action performVisibleDataValidation = () => {
    const currentRow = this.sort.direction === 'ascend'
      ? Math.max(0, this.dataModel.data.length - this.currentRow - MAX_VISIBLE_ROWS_AMOUNT)
      : this.currentRow;
    if (this.dataModel.isEverythingLoadedFromRange(currentRow, currentRow + MAX_VISIBLE_ROWS_AMOUNT)) {
      return;
    }
    const offset = currentRow - UP_ROWS_STOCK;
    this.dataModel.load(offset);
  }

  get columnsOrder() {
    return localStorage.get(this.columnsOrderKey);
  }

  set columnsOrder(order) {
    localStorage.set(this.columnsOrderKey, order);
    this.allColumns.replace(this.allColumns.slice().sort(this.columnsSortPredicate()));
  }

  columnsSortPredicate(defaultSort) {
    let order = this.columnsOrder;
    if (!Array.isArray(order)) {
      order = Object.keys(defaultSort);
      localStorage.set(this.columnsOrderKey, order);
    }
    const ids = {};
    order.forEach((key, id) => { ids[key] = id; });
    return ({ key: keyA }, { key: keyB }) => Math.sign(ids[keyA] - ids[keyB]);
  }

  @action swapColumns(id) {
    const order = this.columnsOrder;
    console.assert(Array.isArray(order), 'columns order implementation error');
    order.splice(id, 2, order[id + 1], order[id]);
    this.columnsOrder = order;
  }

  triggerOpenedRow(index) {
    this.openedRows[this.openedRows.has(index) ? 'delete' : 'add'](index);
  }

  // visibleColumns - ключи колонок, которые видны в данный момент
  @computed get visibleColumns() {
    return localStorage.getItem(this.visibleColumnKey)
    || this.allColumns
      .filter(({ isVisibleByDefault }) => isVisibleByDefault)
      .map(({ key }) => key);
  }

  set visibleColumns(data) {
    return localStorage.setItem(this.visibleColumnKey, data);
  }

  // какое значение сортировки в данный момент
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

  @computed get sortPredicate() {
    const { sort: { column } } = this;
    const columnData = this.allColumns.find(({ key }) => key === column);
    const transform = columnData?.isTransformInSort ? (v) => columnData.transform(v[column], v) : (v) => v[column];
    return (datumA, datumB) => {
      const valA = transform(datumA);
      const valB = transform(datumB);
      if (typeof valA === 'string') {
        if (typeof valB !== 'string') {
          return -1;
        }
        const result = valB.localeCompare(valA);
        if (result !== 0) {
          return -result;
        }
      }
      if (typeof valB === 'string') {
        return 1;
      }
      if (valA > valB) {
        return -1;
      }
      if (valB > valA) {
        return 1;
      }
      return Math.sign(datumA.id - datumB.id);
    };
  }

  // реализует логику клика по колонке сортировки.
  @action changeSort(columnKey) {
    const currentSort = this.sort;

    const column = this.allColumns.find(({ key }) => key === columnKey);
    localStorage.setItem(this.sortKey, (() => {
      if (this.isAsync || (columnKey === currentSort.column && column.sortDirections === 'both')) {
        return {
          column: columnKey,
          direction: currentSort.direction === 'ascend' ? 'descend' : 'ascend',
        };
      }
      return {
        column: columnKey,
        direction: column.sortDirections !== 'ascend' ? 'descend' : 'ascend',
      };
    })());
  }

  @computed get columnsOrderKey() {
    return `${this.toString()}_table_order_columns_settings`;
  }

  @computed get visibleColumnKey() {
    return `${this.toString()}_table_visible_columns_settings`;
  }

  @computed get sortKey() {
    return `${this.toString()}_table_sort_settings`;
  }

  // те колонки, на основе которых строится заголовок и рендерится контент
  @computed get columns() {
    const keys = new Set(this.visibleColumns);
    const columns = this.allColumns.filter(({ key }) => keys.has(key));
    if (this.isAsync) {
      return columns.map((column) => column.asyncOrder());
    }
    return columns;
  }

  @computed get data() {
    if (this.isImpossibleToBeSync) {
      const isReverse = this.sort.direction === 'ascend' && false;
      const result = this.rawData.slice().sort(this.sortPredicate);
      if (isReverse) {
        return result.reverse();
      }
      return result;
    }
    if (this.isAsync) {
      return this.dataModel.data;
    }
    return this.dataModel.data.sort(this.sortPredicate);
  }

  @computed get rawData() {
    if (this.additionalFilter === undefined) {
      return this.dataModel.manager.data;
    }
    return this.dataModel.manager.data.filter(this.additionalFilter);
  }

  @computed get isLoaded() {
    return this.dataModel.isLoaded;
  }

  @computed get freshItems() {
    return this.dataModel.freshItems;
  }

  @computed get isAsync() {
    return this.dataModel.isAsync;
  }

  @action validate() {
    return this.dataModel.validate();
  }

  @computed get newElements() {
    return this.dataModel.newElements;
  }
}

export default Table;
