import { action, computed, observable } from 'mobx';
import { message } from 'antd';

import { updateNotificationSettings } from 'services/notifications';

class SourceNotification {
  /**
   *
   * @param {Number} id source ID
   * @param {String} name source Name
   * @param {Number} salePointId sale point ID
   * @param {Number[]} types default types
   */
  constructor(id, name, salePointId, types = []) {
    this.id = id;
    this.salePointId = salePointId;
    this.name = name;
    this.typeValues = observable.set(types);
  }

  @computed get types() {
    const typesDict = {};

    this.typeValues.forEach((typeId) => {
      typesDict[Number(typeId)] = true;
    });

    return typesDict;
  }

  @computed get key() {
    return this.id;
  }

  @action setType(id, value) {
    if (value) {
      this.typeValues.add(id);
    } else {
      this.typeValues.delete(id);
    }
  }

  @action setTypes(types = []) {
    this.typeValues.replace(new Set(types));
  }

  onChange = (evt) => {
    const { name, checked } = evt.target;

    this.setType(name, checked);

    updateNotificationSettings({
      [this.salePointId]: {
        [this.id]: [...this.typeValues],
      },
    }).then((res) => {
      message.success(`Уведомление ${this.name} успешно обновлено!`);
    }).catch((err) => {
      message.error(`Произошла ошибка при обновлении уведомления ${this.name}!`);
    });
  }
}

export default SourceNotification;
