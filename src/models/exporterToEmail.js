import { message } from 'antd';
import { computed, observable, action } from 'mobx';

const MESSAGE_KEY = 'exporterToEmail';
const MESSAGE_DURATION = 2;

export default class ExporterToEmail {
  /**
   * @method
   * @param {} filter
   * @param {string} email
   */
  sendMethod(filter, email) {
    throw new Error('not implemented');
  }

  /**
   * @type {*}
   */
  filter = null;

  /**
   * @type {{checkDisable: Function, generateConfirmMessage: Function }}
   */
  config = null;

  @observable email = '';

  @observable loading = false;

  /**
   *
   * @param {Function} sendMethod
   * @param {*} filter
   * @param {{checkDisable: Function, generateConfirmMessage: Function }} config
   */
  constructor(sendMethod, filter, config) {
    this.sendMethod = sendMethod;
    this.filter = filter;
    this.config = config;
  }

  @computed get disabled() {
    return this.config?.checkDisable() || false;
  }

  @computed get confirmMessage() {
    return this.config?.generateConfirmMessage() || 'Отправить данные на почту?';
  }

  @computed get isSendDisabled() {
    return !this.email;
  }

  @action.bound onChangeEmail(email) {
    this.email = email;
  }

  @action.bound export() {
    this.loading = true;
    message.loading({ content: `Идет подготовка выгрузки для отправки на почту ${this.email} ...`, key: MESSAGE_KEY, duration: 0 });

    return this.sendMethod(this.filter.search, this.email).then(() => {
      message.success({ content: `Выгрузка успешно отправлена на почту ${this.email}`, key: MESSAGE_KEY, duration: MESSAGE_DURATION });
      this.email = '';
    }).catch(() => {
      message.error({ content: `Не удалось отправить выгрузку на почту ${this.email}`, key: MESSAGE_KEY, duration: MESSAGE_DURATION });
    }).finally(() => {
      this.loading = false;
    });
  }
}
