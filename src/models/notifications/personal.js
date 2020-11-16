/* eslint-disable max-classes-per-file */
import {
  action, computed, observable, transaction, reaction,
} from 'mobx';
import { message } from 'antd';

import { getNotificationSettings, updateNotificationSettings } from 'services/notifications';

class SourceNotification {
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

const STEPS_COUNT = 3;

class MultipleNotificationsEditor {
  @observable selectedSalePoints = new Set();

  @observable selectedSources = new Set();

  @observable selectedTypes = new Set();

  @observable shown = false;

  @observable step = 0;

  @observable loading = false;

  /**
   *
   * @param {Session} session
   * @param {PersonalNotifications} personalNotifications
   */
  constructor(session, personalNotifications) {
    this.session = session;
    this.personalNotifications = personalNotifications;
  }

  @computed get tableConfig() {
    const currentSelectedData = {
      0: this.selectedSalePoints,
      1: this.selectedSources,
      2: this.selectedTypes,
    }[this.step];

    const defaultRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        transaction(() => {
          currentSelectedData.clear();
          selectedRowKeys.forEach((key) => {
            currentSelectedData.add(key);
          });
        });
      },
      selectedRowKeys: [...currentSelectedData],
    };

    switch (this.step) {
      case 0: return {
        columns: [{
          dataIndex: 'name',
          title: 'Название',
        }],
        data: this.salePoints,
        rowSelection: defaultRowSelection,
        text: {
          action: 'Далее',
          description: 'Выберитие объекты, по которым требуется настроить уведомления',
        },
      };
      case 1: return {
        columns: [{
          dataIndex: 'name',
          title: 'Название',
        }],
        data: this.sources,
        rowSelection: defaultRowSelection,
        text: {
          action: 'Далее',
          description: 'Выберитие типы событий, по которым требуется настроить уведомления',
        },
      };
      case 2: return {
        columns: [{
          dataIndex: 'name',
          title: 'Название',
        }],
        data: this.types,
        rowSelection: defaultRowSelection,
        text: {
          action: 'Сохранить',
          description: 'Выберитие каналы отправки, по которым требуется отправлять уведомления',
        },
      };
      default: return {
        columns: [],
        data: [],
        rowSelection: defaultRowSelection,
        text: 'Отмена',
      };
    }
  }

  @computed get types() {
    return this.personalNotifications.types.map((t) => ({ ...t, key: t.id }));
  }

  @computed get sources() {
    return this.personalNotifications.sources.map((s) => ({ ...s, key: s.id }));
  }

  @computed get salePoints() {
    return this.personalNotifications.salePoints.map((sp) => ({ ...sp, key: sp.id }));
  }

  @action.bound next() {
    if (this.step === STEPS_COUNT - 1) {
      this.save();
    } else {
      this.step += 1;
    }
  }

  @action.bound show() {
    this.shown = true;
  }

  @action.bound save() {
    this.loading = true;

    const typesSettings = [...this.selectedTypes];
    const sourcesSettings = [...this.selectedSources].reduce((acc, sourceId) => {
      acc[sourceId] = typesSettings;

      return acc;
    }, {});
    const newNotificationSettings = [...this.selectedSalePoints].reduce((acc, pointId) => {
      acc[pointId] = sourcesSettings;

      return acc;
    }, {});

    updateNotificationSettings(newNotificationSettings).then((res) => {
      message.success('Массовое обновление уведомлений пршло успешно!');
      this.reset();
    }).catch((err) => {
      message.error('Произошла ошибка при массовом обновлении уведомлений!');
      this.reset();
    });
  }

  @action.bound reset() {
    this.selectedSalePoints.clear();
    this.selectedSources.clear();
    this.selectedTypes.clear();

    this.step = 0;
    this.shown = false;
    this.loading = false;
  }
}

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
