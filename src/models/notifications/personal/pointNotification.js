import { computed, transaction } from 'mobx';
import { message } from 'antd';

import { updateNotificationSettings } from 'services/notifications';

import SourceNotification from './sourceNotification';

class PointNotification {
  notifications = [];

  constructor(id, name, sourceNotifications, config) {
    this.id = id;
    this.name = name;
    this.config = config;

    this.setSourceNotifications(sourceNotifications);
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
