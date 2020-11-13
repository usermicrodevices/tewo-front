/* eslint-disable max-classes-per-file */
import {
  action, computed, observable, transaction,
} from 'mobx';

import { getNotificationSettings } from 'services/notifications';

class SourceNotification {
  constructor(id, name, salePointId, types = {}) {
    this.id = id;
    this.salePointId = salePointId;
    this.name = name;
    this.typeValues = observable.map(types);
  }

  @computed get types() {
    const typesDict = {};

    this.typeValues.forEach((value, typeId) => {
      typesDict[Number(typeId)] = value;
    });

    return typesDict;
  }

  @computed get key() {
    return this.id;
  }

  @action setType(id, value) {
    this.typeValues.set(id, Boolean(value));
  }

  onChange = (evt) => {
    const { name, checked } = evt.target;

    // TODO save to server

    this.setType(name, checked);
  }
}

class PointNotification {
  notifications = [];

  constructor(id, name, sourceNotifications, config) {
    this.id = id;
    this.name = name;
    this.config = config;

    if (id === 1) {
      console.log(sourceNotifications);
    }

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

  @computed get types() {
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

    return this.notifications.reduce((acc, notification) => {
      this.config.types.forEach((type) => {
        if (acc[type.id] === undefined) {
          acc[type.id] = notification.types[type.id];
        } else {
          acc[type.id] = acc[type.id] ? notification.types[type.id] : false;
        }
      });

      return acc;
    }, {});
  }

  onChange = (evt) => {
    const { name, checked } = evt.target;

    // TODO save to server

    transaction(() => {
      this.notifications.forEach((notification) => {
        notification.setType(name, checked);
      });
    });
  }
}

class PersonalNotifications {
  @observable notificationSettins = [];

  constructor(session) {
    this.session = session;
    this.settings = observable.object({});

    this.init();
  }

  init = async () => {
    const settings = await getNotificationSettings();

    if (settings) {
      this.settings = settings;
    }
  }

  @computed get types() {
    return this.session.notificationTypes ? this.session.notificationTypes.list : [];
  }

  @computed get sources() {
    return this.session.notificationSources ? this.session.notificationSources.list : [];
  }

  @computed get salePoints() {
    return this.session.points ? this.session.points.rawData : [];
  }

  @computed({ keepAlive: true }) get tableData() {
    console.log(this.settings);

    const config = {
      types: this.types,
    };

    const getSourcesByPoint = (point) => this.sources.map((source) => ({
      name: source.name,
      id: source.id,
      types: this.settings && this.settings[point.id] && this.settings[point.id][source.id]
        ? this.settings[point.id][source.id].types
        : {},
    }));

    const data = this.salePoints.map((point) => new PointNotification(
      point.id,
      point.name,
      getSourcesByPoint(point),
      config,
    ));

    return data;
  }
}

export default PersonalNotifications;
