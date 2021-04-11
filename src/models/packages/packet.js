import { observable, computed } from 'mobx';

class Packet {
  @observable id;

  @observable name;

  @observable description;

  @observable file;

  @observable typeId;

  @observable version;

  session;

  manager;

  constructor(data, session, manager) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.file = data.file;
    this.typeId = data.typeId;
    this.version = data.version;

    this.session = session;
    this.manager = manager;
  }
}

export default Packet;
