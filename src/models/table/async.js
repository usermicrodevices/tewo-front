import {
  observable, action, transaction, reaction,
} from 'mobx';
import { table as constants } from 'config';

// Как часто перезапрашивать данные с начала таблицы
const INVALIDATION_INTERVAL = 3000;
// Сколько подождать после изменения currentRow, чтобы начать дозагрузку
const NEW_CHANGES_WAIT_DELAY = 300;
// Сколько строк максимум может быть видно
const MAX_VISIBLE_ROWS_AMOUNT = 100;
// Сколько строк закружарть выше видимой области
const UP_ROWS_STOCK = Math.floor((constants.preloadLimit - MAX_VISIBLE_ROWS_AMOUNT) / 2);
// Сколько времени элемент помечен как новый
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

  newElements = observable.map();

  isLoaded = true;

  partialLoader;

  table;

  validationTimeout;

  validateAddition = null;

  constructor(partialLoader, amount, results, table) {
    this.partialLoader = partialLoader;
    this.table = table;

    reaction(() => table.currentRow, (currentRow) => {
      setTimeout(() => {
        if (table.currentRow === currentRow) {
          this.makeVisibleDataValidateAddition();
        }
      }, NEW_CHANGES_WAIT_DELAY);
    });

    reaction(() => table.sort, () => {
      this.makeVisibleDataValidateAddition();
    });

    this.setDataHead(results, amount);

    this.keepNewElementsAttention();
  }

  keepNewElementsAttention() {
    this.validationTimeout = setTimeout(() => { this.validateCache(); }, INVALIDATION_INTERVAL);
  }

  forceValidation() {
    this.destruct();
    this.validateCache();
  }

  @action setDataHead(itms, amount) {
    this.data.replace(itms.concat(new Array(amount - itms.length)));
  }

  @action takeData = ({ count, results }) => {
    transaction(() => {
      // В некоторых ситуациях при подгрузке после скрола в начало могут добавляться элементы
      const firstLoadedElementIndex = this.data.findIndex((itm) => typeof itm !== 'undefined');
      // Срезаем у данных голову до лимита загрузки, чтобы все старые элементы из подгруженных сейчас были точно найдены
      const dataHead = this.data.slice(firstLoadedElementIndex, constants.preloadLimit);
      // Создаём таблицу соответствий старых элементов новым
      const appearences = (() => {
        const result = results.reduce((prev, { id, device_date: newTime }, index) => (
          {
            [id]: {
              new: index,
              old: null,
              newTime,
              oldTime: null,
            },
            ...prev,
          }
        ), {});
        dataHead.forEach(({ id, device_date: date }, index) => {
          if (id in result) {
            result[id].old = index;
            result[id].oldTime = date;
          }
        });
        return result;
      })();
      // Находим первый элемент, который не подгружен с сервера
      const firstOld = dataHead.findIndex(({ id }) => !(id in appearences));
      // Ничего не подгружено. Все новые элементы найдены среди старых
      if (firstOld < 0) {
        // Можно ввообще проверить массивы на тождественность но ограничимся чем попроще
        console.assert(firstLoadedElementIndex === 0, 'implementation consistency error');
        return;
      }
      // Запоминаем индексы новых элементов
      for (const { old, new: newIndex } of Object.values(appearences)) {
        if (old === null) {
          this.newElements.set(newIndex, newIndex);
        }
      }
      // Ставим таймер на исключение элементов из новых
      setTimeout(() => { this.newElements.clear(); }, NEW_ELEMENTS_ADDICTIVE_TIME);
      // Это значит, что все элементы новые. Так быть не должно. значит в данных точно есть разрыв
      if (firstOld === 0) {
        console.error('validation algorythm parameners fail', appearences, dataHead, results);
        return;
      }
      // последний не старый соответствует последнему в подгрузке
      if (appearences[dataHead[firstOld - 1].id].new !== results.length - 1) {
        console.error('противоречивая точка слияния', appearences, firstOld, results.length, appearences[dataHead[firstOld - 1].id].new);
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        // если новые элементы встречаются в последней трети подгрузки то нужно запрашивать больше либо чаще
        for (const { old, new: newIndex } of Object.values(appearences)) {
          if (old === null) {
            console.assert(newIndex * 3 / 2 <= results.length);
          }
        }
        // Дальше нужно проверить сортировку. Для этого должно порядок элемента должен меняться только за счет ногово
        const changes = Object.values(appearences).sort(({ new: lId }, { new: rId }) => Math.sign(lId - rId));
        let d = 0;
        for (const { new: newId, old: oldId } of changes) {
          if (oldId === null) {
            d += 1;
          } else if (oldId + d !== newId) {
            console.error('Given data consistency error', changes, oldId, d, newId);
            this.failstate = true;
            return;
          }
        }
      }
      const oldAmount = this.data.length;
      // Заменяем старую голову на новую
      this.data.replace(results.concat(this.data.slice(firstOld)));
      if (process.env.NODE_ENV !== 'production') {
        // бывает, что после всех операций появляется лишний элемент, но не понятно каким образом и не накапливается (исправляется с приходом новых данных)
        if (count !== this.data.length) {
          console.error(`Несоответствие числа записей, ошибка реализации ${count} - ${this.data.length} = ${count - this.data.length}`);
          // ищем в таком случае повторения
          for (let i = 0; i < constants.preloadLimit * 3; i += 1) {
            if (typeof this.data[i] !== 'undefined') {
              for (let j = -10; j < 10; j += 1) {
                if (i + j >= 0 && typeof this.data[i + j] !== 'undefined' && j !== 0) {
                  console.assert(this.data[i + j].id !== this.data[i].id, `duplication ${i} ${this.data[i + j].id}`);
                }
              }
            }
          }
          const newAmount = Object.values(appearences).reduce((prev, { old }) => prev + (old === null), 0);
          console.error(
            `join ${firstOld} ${appearences[dataHead[firstOld - 1].id].new} ${oldAmount} + ${newAmount} = ${oldAmount + newAmount}`,
            count,
            this.data.length,
          );
        }
      }
    });
  };

  @action validateCache() {
    const headCheck = this.partialLoader(constants.preloadLimit);
    headCheck.then(this.takeData).finally(() => { this.keepNewElementsAttention(); });
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
        for (let i = 0; i < Math.min(this.data.length, 1000); i += 1) {
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
    const currentRow = this.table.sort.direction === 'ascend'
      ? Math.max(0, this.data.length - this.table.currentRow - MAX_VISIBLE_ROWS_AMOUNT)
      : this.table.currentRow;
    const visibleRows = this.data.slice(currentRow, currentRow + MAX_VISIBLE_ROWS_AMOUNT);
    if (visibleRows.findIndex((itm) => typeof itm === 'undefined') < 0) {
      return;
    }
    if (this.validateAddition !== null) {
      return;
    }
    const offset = currentRow - UP_ROWS_STOCK;
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
    clearTimeout(this.validationTimeout);
  }
}

export default AsyncCahceManager;
