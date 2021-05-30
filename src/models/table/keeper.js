import {
  reaction, computed, action, observable,
} from 'mobx';

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

  consideredFilter = null;

  @observable manager;

  constructor(filter, loader, isImpossibleToBeAsync, isImpossibleToBeSync) {
    this.loader = loader;
    this.filter = filter;
    this.consideredFilter = filter.clone();
    this.manager = new DataManager(this.partialLoader);

    reaction(() => this.filter.search, () => {
      if (isImpossibleToBeAsync) {
        return;
      }
      if (!this.isAsync && (this.isLoaded && !isImpossibleToBeSync)) {
        const isGreater = this.filter.isGreater(this.consideredFilter);
        if (isGreater) {
          // Если данных мало и фильтр был ужесточен то ничего
          // грузить не надо, можно отфильтровать имеющиеся данные
          return;
        }
      }
      const takenFilter = this.filter.search;
      setTimeout(() => {
        // если фильтр какое-то время не менялся
        if (this.filter.search === takenFilter) {
          // то обновляем менеджер
          this.consideredFilter = filter.clone();
          this.manager = new DataManager(this.partialLoader);
        }
      }, FILTER_CHANGES_REACTION_DELAY);
    });
  }

  reload() {
    this.manager.reload();
  }

  @computed get data() {
    if (this.isAsync) {
      return this.manager.data;
    }
    return this.manager.data.filter(this.filter.predicate);
  }

  get partialLoader() {
    const { search } = this.filter;
    return (limit, offset) => this.loader(limit, offset, search);
  }

  isEverythingLoadedFromRange(limit, offset) {
    return this.manager.isEverythingLoadedFromRange(limit, offset);
  }

  @action validate() {
    return this.manager.validate();
  }

  @computed get isAsync() {
    return this.manager.isAsync;
  }

  @action load(offset) {
    this.manager.validateWithAddition(offset);
  }

  @computed get isLoaded() {
    return this.manager.isLoaded;
  }

  @computed get newElements() {
    return this.manager.newElements;
  }
}

export default Keeper;
