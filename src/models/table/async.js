import {
  observable, action, transaction, reaction,
} from 'mobx';
import { table as constants } from 'config';

const INVALIDATION_INTERVAL = 60000;
const NEW_CHANGES_WAIT_DELAY = 300;
const UP_ROWS_STOCK = 15;

class AsyncCahceManager {
  @observable data = observable.array([]);

  @observable amount;

  isLoaded = true;

  partialLoader;

  constructor(partialLoader, amount, results, table) {
    this.partialLoader = partialLoader;
    this.amount = amount;

    reaction(() => table.currentRow, (currentRow) => {
      setTimeout(() => {
        if (table.currentRow === currentRow) {
          this.resolveVisibleData(constants.preloadLimit, table.currentRow - UP_ROWS_STOCK);
        }
      }, NEW_CHANGES_WAIT_DELAY);
    });

    this.data.replace(results.concat(new Array(amount - results.length)));

    this.validationInterval = setInterval(() => { this.validateCache(); }, INVALIDATION_INTERVAL);
  }

  @action validateCache() {
    this.partialLoader(constants.preloadLimit).then(({ count, results }) => {
      console.assert(this.data.length <= count);
      const newElementsAmount = count - this.data.length;
      if (newElementsAmount > results.length) {
        results.concat(new Array(newElementsAmount - results.length));
      }
      this.data.replace(results.slice(0, newElementsAmount).concat(this.data.slice()));
      console.assert(this.data.length === count, 'Ошибка внутренней логики');
      results.forEach((datum, id) => {
        console.assert(this.data[id].id === datum.id, 'Полученные даные совпадают по номеру но не по идентификатору');
      });
    });
  }

  @action resolveVisibleData(limit, offset) {
    this.partialLoader(limit, offset).then(({ count, results }) => {
      transaction(() => {
        if (this.data.length !== count) {
          console.assert(this.data.length < count);
          this.data.replace(new Array(count - this.data.length).concat(this.data.slice()));
        }
        for (let i = 0; i < results.length; i += 1) {
          console.assert(
            (typeof this.data[i + offset]) === 'undefined' || results[i].id === this.data[i + offset].id,
            'Полученные даные совпадают по номеру но не по идентификатору',
          );
          this.data[i + offset] = results[i];
        }
      });
    });
  }
}

export default AsyncCahceManager;
