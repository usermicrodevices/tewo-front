import {
  reaction, computed,
} from 'mobx';

import Filter from './filters';
import DataManager from './dataManager';

// Как быстро реагировать на изменения фильтра
const FILTER_CHANGES_REACTION_DELAY = 1000;

/** Модель асинхронной подгрузки данных
 * Модель решает две основных проблемы:
 * 1. Подгрузку данных, добавленных в базу во время существования модели
 * 2. Загрузка данных при скроле из произвольного места базы
 * Проблема в том, что в базе неперывно добавляются и удаляются элементы.
 * Из-за этого очень сложно подгрузить данные в глубине массива не нарушив
 * консистентность кеша: между запросом валидации начала данных и запросом
 * данных из глубины таблицы будут добавлены данные и консистентность кеша
 * может быть нарушена. Этот эффект не полностью устранён но минимизирован
 * за счет того, что запросы в кглубину таблицы выполняются однавременно с
 * валидацией заголовка.
 */
class Keeper {
  loader;

  filter;

  manager;

  constructor(filter, loader) {
    this.loader = loader;
    this.filter = filter;
    this.manager = new DataManager(this.partialLoader);

    reaction(() => this.filter.search, (search) => {
      this.setTimeout(() => {
        if (this.filter.search !== search) {
          if (this.manager.isAsync || this.filter.less(new Filter(search, this.filter.columns))) {
            this.manager = new DataManager(this.partialLoader);
          }
        }
      }, FILTER_CHANGES_REACTION_DELAY);
    });
  }

  @computed get data() {
    if (this.isAsync) {
      return this.manager.data;
    }
    return this.data.filter(this.filter.predicate).sort(this.sort);
  }

  get partialLoader() {
    return (limit, offset) => this.loader(limit, offset, this.filter.search);
  }
}

export default Keeper;
