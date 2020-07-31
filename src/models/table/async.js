import {
  observable, action, transaction, reaction,
} from 'mobx';
import { table as constants } from 'config';

const INVALIDATION_INTERVAL = 3000;
const NEW_CHANGES_WAIT_DELAY = 300;
const MAX_VISIBLE_ROWS_AMOUNT = 100;
const UP_ROWS_STOCK = Math.floor((constants.preloadLimit - MAX_VISIBLE_ROWS_AMOUNT) / 2);
const NEW_ELEMENTS_ADDICTIVE_TIME = 1000;

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
class AsyncCahceManager {
  @observable data = observable.array([]);

  @observable amount;

  @observable freshItems = 0;

  isLoaded = true;

  partialLoader;

  table;

  validationInterval;

  validateAddition = null;

  constructor(partialLoader, amount, results, table) {
    this.partialLoader = partialLoader;
    this.amount = amount;
    this.table = table;

    reaction(() => table.currentRow, (currentRow) => {
      setTimeout(() => {
        if (table.currentRow === currentRow) {
          this.makeVisibleDataValidateAddition();
        }
      }, NEW_CHANGES_WAIT_DELAY);
    });

    this.setDataHead(results);

    this.validationInterval = setInterval(() => { this.validateCache(); }, INVALIDATION_INTERVAL);
  }

  forceValidation() {
    this.destruct();
    this.validationInterval = setInterval(() => { this.validateCache(); }, INVALIDATION_INTERVAL);
    this.validateCache();
  }

  @action setDataHead(itms) {
    this.data.replace(itms.concat(new Array(this.amount - itms.length)));
  }

  debugGivenData(results) {
    const old = this.data.slice(0, constants.preloadLimit);
    console.log('старые данные:');
    for (const itm of old) {
      console.log(itm.id, itm.cid, +new Date(itm.created_date));
    }
    console.log('новые данные:');
    results.forEach((itm, pos) => {
      const oldId = (() => {
        for (let i = 0; i < old.length; i += 1) {
          if (old[i].id === itm.id) {
            return i;
          }
        }
        return -1;
      })();
      let description;
      if (oldId === -1) {
        description = 'Новый';
      } else {
        description = `старая позиция ${oldId} смещение ${pos - oldId}`;
      }
      console.log(itm.id, itm.cid, +new Date(itm.created_date), description);
    });
  }

  @action validateCache() {
    const headCheck = this.partialLoader(constants.preloadLimit);
    headCheck.then(({ count, results }) => {
      transaction(() => {
        const firstLoadedElementIndex = this.data.findIndex((itm) => typeof itm !== 'undefined');
        const mergePoint = (() => {
          const soughtId = this.data[firstLoadedElementIndex].id;
          return results.findIndex(({ id }) => id === soughtId);
        })();
        if (mergePoint === -1) {
          this.amount = count;
          this.setDataHead(results);
          return;
        }
        if (mergePoint === 0) {
          this.checkValidationResults(results);
          return;
        }
        console.log(this.amount, count, mergePoint, count - this.amount);
        this.freshItems = mergePoint;
        setTimeout(() => { this.freshItems = 0; }, NEW_ELEMENTS_ADDICTIVE_TIME);
        if (this.table.currentRow !== 0) {
          this.table.currentRow += mergePoint;
        }
        this.amount = count;
        this.data.replace(results.slice(0, mergePoint).concat(this.data.slice(firstLoadedElementIndex)).slice(0, count));
        this.checkValidationResults(results);
      });
    });
    if (!this.validateAddition) {
      return;
    }
    const { addition: additionRequest, offset } = this.validateAddition();
    this.validateAddition = null;
    headCheck.then(() => {
      additionRequest.then((addition) => {
        this.resolveDataRange(addition, offset);
      });
    });
    Promise.all([headCheck, additionRequest]).then(([{ count: headAmount }, { count: additionAmount }]) => {
      console.assert(headAmount === additionAmount, `Добавление элемента во время запроса данных ${headAmount} ${additionAmount}`);
    });
  }

  checkValidationResults(results) {
    results.forEach((datum, id) => {
      const find = () => {
        for (let i = 0; i < this.data.length; i += 1) {
          if (typeof this.data[i] !== 'undefined' && this.data[i].id === datum.id) {
            return i;
          }
        }
        return -1;
      };
      console.assert(
        this.data[id].id === datum.id,
        `Полученные даные совпадают по номеру но не по идентификатору ${id}: ${this.data[id].id} ${datum.id} (${find()} ${id})`,
      );
    });
  }

  @action makeVisibleDataValidateAddition() {
    const visibleRows = this.data.slice(this.table.currentRow, this.table.currentRow + MAX_VISIBLE_ROWS_AMOUNT);
    if (visibleRows.findIndex((itm) => typeof itm === 'undefined') < 0) {
      return;
    }
    if (this.validateAddition !== null) {
      return;
    }
    const offset = this.table.currentRow - UP_ROWS_STOCK;
    if (offset <= 0) {
      return;
    }
    this.validateAddition = () => {
      const addition = this.partialLoader(constants.preloadLimit, offset);
      return { addition, offset };
    };
    this.forceValidation();
  }

  @action resolveDataRange({ results }, offset) {
    transaction(() => {
      for (let i = 0; i < results.length; i += 1) {
        this.data[i + offset] = results[i];
      }
    });
  }

  destruct() {
    clearInterval(this.validationInterval);
  }
}

export default AsyncCahceManager;
