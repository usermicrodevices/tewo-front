import { computed, observable } from 'mobx';

class Session {
  session;

  manager;

  @observable id;

  @observable description;

  @observable devices;

  @observable packetId;

  @observable created;

  @observable updated;

  @observable statusId;

  @computed get devicesId() {
    return new Set(this.devices.map(({ id }) => id));
  }

  @computed get packet() {
    return this.manager.packets.get(this.packetId);
  }

  @computed get packetType() {
    return this.manager.packets.getType(this.packetId);
  }

  @computed get packetName() {
    return this.packet?.name;
  }

  @computed get version() {
    return this.packet?.version;
  }

  @computed get packetTypeName() {
    return this.packetType?.name;
  }

  @computed get status() {
    return this.manager.sessionStatuses.get(this.statusId);
  }

  @computed get statusName() {
    return this.status?.name;
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
    this.statusId = data.statusId;
  }
}

export default Session;
