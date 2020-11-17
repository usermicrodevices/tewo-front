import { computed, transaction } from 'mobx';
import { message } from 'antd';

import { updateNotificationSettings } from 'services/notifications';

import SourceNotification from './sourceNotification';

class PointNotification {
  notifications = [];

  config = { types: [], sources: [], settings: {} }

  point = null;

  /**
   *
   * @param {Object} point SalePoint instance
   * @param {Object} config base notifications config
   * @param {Number[]} config.types available types
   * @param {Number[]} config.sources available sources
   * @param {Object} config.settings user types configurations
   */
  constructor(point, config) {
    this.point = point;
    this.config = config;

    const sources = config.sources.map((source) => ({
      name: source.name,
      id: source.id,
      types: config.settings && config.settings[point.id] && config.settings[point.id][source.id]
        ? config.settings[point.id][source.id].types
        : [],
    }));

    this.setSourceNotifications(sources);
  }

  setSourceNotifications(sourceNotifications = []) {
    const newSourceNotifications = sourceNotifications.map((sourceNotification) => new SourceNotification(
      sourceNotification.id,
      sourceNotification.name,
      this.id,
      sourceNotification.types,
    ));

    this.notifications = newSourceNotifications;
  }

  @computed get name() {
    return this.point.name;
  }

  @computed get id() {
    return this.point.id;
  }

  @computed get key() {
    return this.id;
  }

  @computed({ keepAlive: true }) get types() {
    return this.config.types.reduce((acc, type) => {
      const isAllEnabled = this.notifications.every((v) => v.types[type.id]);
      const isSomeEnabled = this.notifications.some((v) => v.types[type.id]);

      if (isAllEnabled) {
        acc[type.id] = true;
      } else if (isSomeEnabled) {
        acc[type.id] = null;
      } else {
        acc[type.id] = false;
      }

      return acc;
    }, {});
  }

  setChildTypes = (notificationsTypes) => {
    transaction(() => {
      this.notifications.forEach((notification) => {
        if (notificationsTypes[notification.id]) {
          notification.setTypes(notificationsTypes[notification.id]);
        }
      });
    });
  }

  onChange = (evt) => {
    const { name, checked } = evt.target;

    transaction(() => {
      this.notifications.forEach((notification) => {
        notification.setType(name, checked);
      });

      updateNotificationSettings({
        [this.id]: this.notifications.reduce((acc, notification) => {
          acc[notification.id] = [...notification.typeValues];

          return acc;
        }, {}),
      }).then((res) => {
        message.success(`Уведомления для объекта ${this.name} успешно обновлено!`);
      }).catch((err) => {
        message.error(`Произошла ошибка при обновлении уведомлений для объекта ${this.name}!`);
      });
    });
  }
}

export default PointNotification;
