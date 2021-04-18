import { computed, observable } from 'mobx';

class Session {
  session;

  manager;

  @observable id;

  @observable name;

  @observable description;

  @observable devices;

  @observable packetId;

  @observable created;

  @observable updated;

  @computed get devicesId() {
    return new Set(this.devices.map(({ id }) => id));
  }

  @computed get packet() {
    return this.manager.packets.get(this.packetId);
  }

  @computed get packetType() {
    return this.manager.packets.getType(this.packetId);
  }

  @computed get version() {
    return this.packet?.version;
  }

  @computed get packetTypeName() {
    return this.packetType?.name;
  }

  constructor(data, session, manager) {
    this.session = session;
    this.manager = manager;

    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.devices = data.devices;
    this.packetId = data.packetId;
    this.created = data.created;
    this.updated = data.updated;
  }
}

export default Session;
