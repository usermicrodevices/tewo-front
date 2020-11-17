import {
  action, computed, observable, transaction,
} from 'mobx';
import { message } from 'antd';

import { updateNotificationSettings } from 'services/notifications';

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
      message.success('Массовое обновление уведомлений прошло успешно!');
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

export default MultipleNotificationsEditor;
