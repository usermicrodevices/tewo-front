import { transaction } from 'mobx';

class Datum {
  updater;

  constructor(updater) {
    this.updater = updater;
  }

  isSomeChanged(data) {
    if (this.id === null) {
      return true;
    }
    for (const [key, value] of Object.entries(data)) {
      if (this[key] !== value) {
        return true;
      }
    }
    return false;
  }

  genericValidation(data) {
    const { editable, values } = this;
    for (const [key, { isRequired }] of Object.entries(editable)) {
      const value = data[key];
      if (isRequired && (value === '' || value === null || typeof value === 'undefined')) {
        return `Не задано обязательное поле ${values.find(({ dataIndex }) => dataIndex === key)?.title}`;
      }
    }
    return true;
  }

  update(data, ...aditionalArgs) {
    console.assert(
      Object.entries(data).filter(([key]) => typeof this[key] === 'undefined').length === 0,
      'not all keys from update data is expected in object',
      this,
      data,
    );

    const genericValidationResult = this.genericValidation(data);
    if (genericValidationResult !== true) {
      return Promise.reject(new Error(genericValidationResult));
    }

    if (typeof this.validation === 'function') {
      const result = this.validation(data);
      if (result !== true) {
        return Promise.reject(new Error(result));
      }
    }

    if (this.isSomeChanged(data)) {
      return this.updater(this.id, data, ...aditionalArgs).then((newData) => {
        const isNew = this.id === null;
        transaction(() => {
          for (const [key, value] of Object.entries(newData)) {
            this[key] = value;
          }
        });
        if (isNew && typeof this.onCreated === 'function') {
          this.onCreated();
        }
        return newData;
      });
    }
    return Promise.resolve({ ok: true, notUpdated: true });
  }
}

export default Datum;
