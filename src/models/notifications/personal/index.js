import {
  computed, observable, reaction, action,
} from 'mobx';

import { getNotificationSettings } from 'services/notifications';

import Filters from 'models/filters';

import MultipleNotificationsEditor from './multipleNotificationsEditor';
import PointNotification from './pointNotification';

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.point.companyId),
    selector: () => session.companies.selector,
  },
});

class PersonalNotifications {
  @observable settings = null;

  @observable multipleEditor = null;

  @observable data = [];

  filters = null;

  /**
   *
   * @param {Session} session
   */
  constructor(session) {
    this.session = session;
    this.multipleEditor = new MultipleNotificationsEditor(session, this);
    this.filters = new Filters(declareFilters(session));

    this.fetchSettings();

    reaction(() => Boolean(this.settings && this.types.length && this.sources.length && this.salePoints.length), this.initializeTableData);
  }

  initializeTableData = () => {
    const config = {
      types: this.types,
      sources: this.sources,
      settings: this.settings,
    };

    const data = this.salePoints.map((point) => new PointNotification(point, config));

    this.data = data;
  }

  fetchSettings = async () => {
    const settings = await getNotificationSettings();

    if (settings) {
      this.settings = settings;
    }
  }

  @action.bound updateSettings(settings) {
    this.data.forEach((point) => {
      if (settings[point.id]) {
        point.setChildTypes(settings[point.id]);
      }
    });
  }

  @action.bound setSearch(search) {
    this.filters.searchText = search;
  }

  @computed get search() {
    return this.filters.searchText;
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
    return this.data.filter(this.filters.predicate);
  }
}

export default PersonalNotifications;
