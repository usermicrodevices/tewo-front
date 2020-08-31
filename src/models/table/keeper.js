import {
  reaction, computed, action, observable, transaction,
} from 'mobx';

import Filter from 'models/filters';
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

  @observable additionFilter = null;

  @observable manager;

  constructor(filter, loader, isImpossibleToBeAsync) {
    this.loader = loader;
    this.filter = filter;
    this.manager = new DataManager(this.partialLoader);

    reaction(() => this.filter.search, () => {
      if (isImpossibleToBeAsync) {
        return;
      }
      console.log('cahnges detected, set timeout');
      const { search } = this.filter;
      setTimeout(() => {
        if (this.filter.search === search) {
          transaction(() => {
            console.log('changes accepted, additional tests', this.isAsync);
            this.additionFilter = this.filter.complement(new Filter(search, this.filter.columns));
            console.log(`${!!this.additionFilter} difference`);
            // если фильтр стал свободнее то перезагружаем данные для проверки размера новоый выборки
            if (this.additionFilter === null) {
              console.log('data manager reinstanciations');
              this.manager = new DataManager(this.partialLoader);
            }
          });
        }
      }, FILTER_CHANGES_REACTION_DELAY);
    });
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
