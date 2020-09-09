import { transaction } from 'mobx';

class Datum {
  updater;

  constructor(updater) {
    this.updater = updater;
  }

  isSomeChanged(data) {
    for (const [key, value] of Object.entries(data)) {
      if (this[key] !== value) {
        return true;
      }
    }
    return false;
  }

  update(data) {
    console.assert(
      Object.entries(data).filter(([key]) => typeof this[key] === 'undefined').length === 0,
      'not all keys from update data is expected in pbject',
      this,
      data,
    );

    if (this.isSomeChanged(data)) {
      return this.updater(this.id, data).then((response) => {
        transaction(() => {
          for (const [key, value] of Object.entries(data)) {
            this[key] = value;
          }
          return response;
        });
      });
    }
    return Promise.resolve({ ok: true, notUpdated: true });
  }
}

export default Datum;
