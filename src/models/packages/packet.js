import { observable, computed } from 'mobx';

class Packet {
  @observable id;

  @observable name;

  @observable description;

  @observable file;

  @observable typeId;

  @observable version;

  @computed get created() {
    return this.session?.created;
  }

  @computed get type() {
    return this.manager.packetTypes.get(this.typeId);
  }

  @computed get typeName() {
    return this.type?.name;
  }

  @computed get session() {
    return this.manager.sessions.getByPacketId(this.id);
  }

  webSession;

  manager;

  constructor(data, session, manager) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.file = data.file;
    this.typeId = data.typeId;
    this.version = data.version;

    this.webSession = session;
    this.manager = manager;
  }
}

export default Packet;
