/* eslint-disable max-classes-per-file */
import {
  computed, observable, reaction, action,
} from 'mobx';

import { getNotificationSettings, getNotificationDelays } from 'services/notifications';

import Filters from 'models/filters';

import MultipleNotificationsEditor from './multipleNotificationsEditor';
import PointNotification from './pointNotification';
import NotificationDelay from './notificationDelay';

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.point.companyId),
    selector: () => session.companies.selector,
  },
});

class PersonalNotifications {
  @observable notificationSettings = null;

  @observable notificationDelaysCurrent = null;

  @observable multipleEditor = null;

  @observable pointNotifications = [];

  @observable notificationDelays = [];

  notificationFilters = null;

  /**
   *
   * @param {Session} session
   */
  constructor(session) {
    this.session = session;
    this.multipleEditor = new MultipleNotificationsEditor(session, this);
    this.notificationFilters = new Filters(declareFilters(session));

    this.fetchSettings();
    this.fetchDelaySettings();

    reaction(() => Boolean(this.notificationSettings && this.types.length && this.sources.length && this.salePoints.length), this.initializePointNotifications);
    reaction(() => Boolean(this.notificationDelaysCurrent && this.sources.length), this.initializeNotificationDelays);
  }

  initializePointNotifications = () => {
    const config = {
      types: this.types,
      sources: this.sources,
      settings: this.notificationSettings,
    };

    this.pointNotifications = this.salePoints.map((point) => new PointNotification(point, config));
  }

  initializeNotificationDelays = () => {
    const currentDelayBySourceId = {};

    this.notificationDelaysCurrent.forEach((delay) => {
      currentDelayBySourceId[delay.source] = delay;
    });

    this.notificationDelays = this.sources.map((source) => {
      const delay = currentDelayBySourceId[source.id];

      if (delay) {
        return new NotificationDelay(delay.id, source, delay.interval);
      }

      return new NotificationDelay(null, source, null);
    });
  }

  fetchSettings = async () => {
    const settings = await getNotificationSettings();

    if (settings) {
      this.notificationSettings = settings;
    }
  }

  fetchDelaySettings = async () => {
    const delays = await getNotificationDelays();

    if (delays) {
      this.notificationDelaysCurrent = delays;
    }
  }

  @action.bound updateSettings(settings) {
    this.pointNotifications.forEach((point) => {
      if (settings[point.id]) {
        point.setChildTypes(settings[point.id]);
      }
    });
  }

  @action.bound setSearch(search) {
    this.notificationFilters.searchText = search;
  }

  @computed get search() {
    return this.notificationFilters.searchText;
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

  @computed get tableData() {
    return this.pointNotifications.filter(this.notificationFilters.predicate);
  }
}

export default PersonalNotifications;
