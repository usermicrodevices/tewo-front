import { observable } from 'mobx';

export default class {
  @observable devices = new Set();

  @observable packet = null;

  @observable name = '';

  @observable description = '';
}
