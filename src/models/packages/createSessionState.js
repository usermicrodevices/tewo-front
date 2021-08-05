import { observable } from 'mobx';

export default class {
  @observable devices = new Set();

  @observable packet = null;

  @observable name = 'не введённое имя';

  @observable description = 'не введённое описание';
}
