import { computed, observable, reaction } from 'mobx';

import { getNotificationSettings } from 'services/notifications';

import MultipleNotificationsEditor from './multipleNotificationsEditor';
import PointNotification from './pointNotification';

class PersonalNotifications {
  @observable settings = null;

  @observable multipleEditor = null;

  @observable tableData = [];

  /**
   *
   * @param {Session} session
   */
  constructor(session) {
    this.session = session;
    this.multipleEditor = new MultipleNotificationsEditor(session, this);

    this.fetchSettings();

    reaction(() => Boolean(this.settings && this.types.length && this.sources.length && this.salePoints.length), () => {
      const config = {
        types: this.types,
      };

      const getSourcesByPoint = (point) => this.sources.map((source) => ({
        name: source.name,
        id: source.id,
        types: this.settings && this.settings[point.id] && this.settings[point.id][source.id]
          ? [...this.settings[point.id][source.id].types]
          : [],
      }));

      const data = this.salePoints
        .map((point) => new PointNotification(
          point.id,
          point.name,
          getSourcesByPoint(point),
          config,
        ));

      this.tableData = data;
    });
  }

  fetchSettings = async () => {
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
}

export default PersonalNotifications;
