/* eslint-disable max-classes-per-file */
import {
  action, computed, observable, transaction,
} from 'mobx';

class SourceNotification {
  constructor(id, name, types) {
    this.id = id;
    this.name = name;
    this.typeValues = observable.map({
      1: Math.random() > 0.01,
      2: Math.random() > 0.01,
      3: Math.random() > 0.01,
    });
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

    this.setType(name, checked);
  }
}

class PointNotification {
  notifications = [];

  constructor(id, name, sourceNotifications) {
    this.id = id;
    this.name = name;

    this.setSourceNotifications(sourceNotifications);
  }

  setSourceNotifications(sourceNotifications = []) {
    const newSourceNotifications = sourceNotifications.map((sourceNotification) => new SourceNotification(
      sourceNotification.id,
      sourceNotification.name,
      // sourceNotification.types,
    ));

    this.notifications = newSourceNotifications;
  }

  @computed get key() {
    return this.id;
  }

  @computed get types() {
    return this.notifications.reduce((acc, notification) => {
      Object.keys(notification.types).forEach((type) => {
        if (acc[type] === undefined) {
          acc[type] = notification.types[type];
        } else {
          acc[type] = acc[type] ? notification.types[type] : false;
        }
      });

      return acc;
    }, {});
  }

  onChange = (evt) => {
    const { name, checked } = evt.target;

    transaction(() => {
      this.notifications.forEach((notification) => {
        notification.setType(name, checked);
      });
    });
  }
}

class PersonalNotifications {
  @observable settings = [];

  @observable notificationSettins = [];

  constructor(session) {
    this.session = session;
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
    console.log('CALCULATE TABLE DATA');

    return this.salePoints.map((point) => new PointNotification(
      point.id,
      point.name,
      this.sources.map((source) => ({
        name: source.name,
        id: source.id,
        // TODO get types from NotificationCurrentConfig
      })),
    ));
  }
}

export default PersonalNotifications;
