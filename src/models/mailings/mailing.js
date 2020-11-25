import { computed, observable, action } from 'mobx';
import { message } from 'antd';

import { applyMailing } from 'services/mailings';

import Datum from 'models/datum';

class Mailing extends Datum {
  @observable id = null;

  @observable name = '';

  @observable companyId = null;

  /** {[pointId]: {sources: Set, id: Number}} */
  @observable notifications = new Map();

  @observable emails = [];

  pointNotificationIds = new Map();

  constructor(session) {
    super(session.mailings.update);

    this.session = session;
  }

  @action.bound saveNotifications() {
    return applyMailing(this.id, { notifications: this.notifications }, this.session, this)
      .then(() => {
        message.success('Обновление уведомлений по рассылке прошло успешно!');
      })
      .catch(() => {
        message.error('Произошла ошибка при обновлении уведомлений по рассылке!');
      });
  }

  @action.bound setNotification(pointId, notificationId, enabled) {
    const notification = this.notifications.get(pointId);
    const newNotification = notification ? {
      id: notification.id,
      sources: notification.sources,
    } : {
      sources: new Set(),
    };

    if (enabled) {
      newNotification.sources.add(notificationId);
    } else {
      newNotification.sources.delete(notificationId);
    }

    this.notifications.set(pointId, newNotification);

    this.saveNotifications();
  }

  @computed get pointsNotifications() {
    const { notificationSources, points } = this.session;
    const companyPoints = points.getByCompanyIdSet(new Set([this.companyId]));

    if (companyPoints === undefined) {
      return undefined;
    }

    return companyPoints.map((point) => {
      const notifications = notificationSources.list.map((source) => ({
        id: source.id,
        name: source.name,
        enabled: this.notifications.has(point.id) && this.notifications.get(point.id).sources.has(source.id),
      }));

      return {
        id: point.id,
        name: point.name,
        enabledCount: notifications.filter((e) => e.enabled).length,
        allCount: notifications.length,
        notifications,
      };
    });
  }

  @computed get company() {
    const { companyId } = this;
    if (typeof companyId !== 'number') {
      return companyId;
    }
    return this.session.companies.get(companyId);
  }

  @computed get companyName() {
    return this.company?.name;
  }

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
      {
        dataIndex: 'companyId',
        title: 'Компания',
        value: this.companyName,
      },
      {
        dataIndex: 'emails',
        title: 'Адреса',
        value: this.emails,
      },
    ];
  }

  get editable() {
    return {
      name: {
        type: 'text',
        isRequired: true,
      },
      companyId: {
        type: 'selector',
        selector: this.session.companies.selector,
        isRequired: true,
      },
      emails: {
        type: 'tags',
        selector: this.emails,
        isRequired: true,
      },
    };
  }
}

export default Mailing;
