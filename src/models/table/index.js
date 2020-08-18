/* eslint class-methods-use-this: "off" */
import {
  computed, observable, action, reaction,
} from 'mobx';
import moment from 'moment';
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

  // Верхняя строчка скролла
  @observable currentRow;

  constructor(columnsMap, loader, filter) {
    console.assert(this.toString() !== '[object Object]', 'Не реализован метод toString для наследника Table');
    this.allColumns = Object.entries(columnsMap).map(([key, value]) => new Column(key, value));
    console.assert(
      this.allColumns.filter(({ isAsyncorder }) => isAsyncorder).length === 1,
      `Таблица ${this.toString()} не получила корректного асинхронного ключа сортировки`,
    );
    console.assert(
      this.allColumns.filter(({ isDefaultSort }) => isDefaultSort).length === 1,
      `Таблица ${this.toString()} не получила ключа сортировки по умолчанию`,
    );
    this.dataModel = new Keeper(filter, loader);

    reaction(() => this.currentRow, (scrollEventMomentRow) => {
      setTimeout(() => {
        if (this.currentRow === scrollEventMomentRow) {
          this.performVisibleDataValidation();
        }
      }, NEW_CHANGES_WAIT_DELAY);
    });

    reaction(() => this.sort, this.performVisibleDataValidation);
  }

  get filter() {
    return this.dataModel.filter;
  }

  @action performVisibleDataValidation = () => {
    const currentRow = this.sort.direction === 'ascend'
      ? Math.max(0, this.dataModel.amount - this.currentRow - MAX_VISIBLE_ROWS_AMOUNT)
      : this.currentRow;
    if (this.dataModel.isEverythingLoadedFromRange(currentRow, currentRow + MAX_VISIBLE_ROWS_AMOUNT)) {
      return;
    }
    const offset = currentRow - UP_ROWS_STOCK;
    this.dataModel.load(offset);
  }

  // visibleColumns - ключи колонок, которые видны в данный момент
  @computed get visibleColumns() {
    return localStorage.getItem(this.visibleColumnKey)
    || this.allColumns
      .filter(({ isVisbleByDefault }) => isVisbleByDefault)
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
    return (datumA, datumB) => {
      const valA = datumA[column];
      const valB = datumB[column];
      if (typeof valA === 'string') {
        const result = valB.localeCompare(valA);
        if (result !== 0) {
          return result * 1;
        }
      }
      if (valA > valB) {
        return 1;
      }
      if (valB > valA) {
        return -1;
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
    if (this.isAsync) {
      return this.dataModel.data;
    }
    return this.dataModel.data.sort(this.sortPredicate);
  }

  @computed get rawData() {
    return this.dataModel.manager.data;
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

  @action updateFilters(search) {
    this.dataModel.search = search;
  }

  @action validate() {
    return this.dataModel.validate();
  }
}

export default Table;
