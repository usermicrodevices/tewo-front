import {
  observable, action, transaction, computed,
} from 'mobx';
import { table as constants } from 'config';

/**
 * Основная функция менеджера: запрос и обработка данных, появившихся
 * в таблице с момента предыдущей загрузки. Не зависимо о того, используется-ли
 * динамическая модель или статическая, в таблице могут появится новые данные,
 * Требуется-ли проверка на появление новых данных или нет - компетенция страницы,
 * менеджер просто предоставляет возможность подгружать эти данные. Как часто
 * и нужно-ли вообще - решает страница.
 * В результате обновления новые элементы появятся в data а в newElements упадут
 * порядковые номера строк, подгруженных  в результате обновления.
 */

// Сколько времени элемент помечен как новый
const NEW_ELEMENTS_ADDICTIVE_TIME = 1000;

class DataManager {
  data = observable.array([]);

  newElements = observable.set();

  partialLoader;

  @observable isAsync = null;

  constructor(partialLoader) {
    this.partialLoader = partialLoader;

    this.partialLoader(constants.preloadLimit).then(({ count: amount, results }) => {
      transaction(() => {
        this.data.replace(results.concat(new Array(amount - results.length)));
        this.isAsync = amount !== results.length && constants.smallDataLimit < amount;
        if (!this.isAsync && amount !== results.length) {
          this.partialLoader(amount).then(({ results: wholeData }) => {
            this.data.replace(wholeData);
          });
        }
      });
    });
  }

  @computed get isLoaded() {
    return this.isAsync !== null;
  }

  @action takeData = (data) => {
    const { count, results } = data;
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
          this.newElements.add(newIndex);
        }
      }
      // Ставим таймер на исключение элементов из новых
      setTimeout(() => { this.newElements.clear(); }, NEW_ELEMENTS_ADDICTIVE_TIME);
      if (firstOld === 0) {
        console.log('rare update branch');
        // Это значит, что все элементы новые. Значит, что данные обновили после большой паузы.
        console.assert(
          this.amount + results.length < count,
          `Противоречивое состояние данных: firstOld === 0 && ${this.amount} + ${results.length} < ${count}`,
        );
        this.data.replace(results.concat(new Array(count - this.data.length - results.length).concat(this.data.slice())));
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
        // Дальше нужно проверить сортировку. Для этого должно место элемента должно меняться только за счет ногово
        const changes = Object.values(appearences).sort(({ new: lId }, { new: rId }) => Math.sign(lId - rId));
        let d = 0;
        for (const { new: newId, old: oldId } of changes) {
          if (oldId === null) {
            d += 1;
          } else if (oldId + d !== newId) {
            console.error('Given data consistency error', changes, oldId, d, newId);
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
            if (i < this.data.length && typeof this.data[i] !== 'undefined') {
              for (let j = -10; j < 10; j += 1) {
                if (i + j >= 0 && i + j < this.data.length && typeof this.data[i + j] !== 'undefined' && j !== 0) {
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
    return data;
  };

  @action validate() {
    const headCheck = this.partialLoader(constants.preloadLimit).then(this.takeData);
    if (!this.validateAddition) {
      return headCheck;
    }
    const { addition: additionRequest, offset } = this.validateAddition();
    this.validateAddition = null;
    headCheck.then(() => {
      additionRequest.then((addition) => {
        this.resolveDataRange(addition, offset);
      });
    });
    return Promise.all([headCheck, additionRequest]).then(([{ count: headAmount }, { count: additionAmount }]) => {
      console.assert(headAmount === additionAmount, `Добавление элемента во время запроса данных ${headAmount} ${additionAmount}`);
    });
  }

  isEverythingLoadedFromRange(begin, end) {
    const suggestedRows = this.data.slice(begin, end);
    return suggestedRows.findIndex((itm) => typeof itm === 'undefined') < 0;
  }

  @action validateWithAddition(offset) {
    if (!this.isAsync) {
      return;
    }
    this.validateAddition = () => {
      const addition = this.partialLoader(constants.preloadLimit, offset);
      return { addition, offset };
    };
    this.validate();
  }

  @action resolveDataRange({ results }, offset) {
    transaction(() => {
      for (let i = 0; i < results.length; i += 1) {
        this.data[i + offset] = results[i];
      }
    });
  }

  @computed get amount() {
    return this.data.length;
  }
}

export default DataManager;
