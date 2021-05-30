import { computed, observable, transaction } from 'mobx';

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

  @observable isCanceling = false;

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

  @computed get packetDescription() {
    return this.packet?.description;
  }

  @computed get isAccureCancelable() {
    if (!this.isCancelable) {
      return false;
    }
    return this.devices.find(({ statusId }) => {
      const deviceStatus = this.manager.deviceStatuses.get(statusId);
      return deviceStatus?.isCancelable;
    }) !== undefined;
  }

  @computed get version() {
    return this.packet?.version;
  }

  @computed get packetTypeName() {
    return this.packetType?.name;
  }

  @computed get devicesReadyCount() {
    const DEVICE_LOADING_STATUS_ID = 5;
    return this.devices.filter(({ status }) => status >= DEVICE_LOADING_STATUS_ID).length;
  }

  @computed get devicesCount() {
    return this.devices.length;
  }

  @computed get progress() {
    return this.isLoading ? this.devicesReadyCount / this.devicesCount : 100;
  }

  @computed get status() {
    return this.manager.sessionStatuses.get(this.statusId);
  }

  @computed get statusName() {
    return this.status?.name;
  }

  @computed get isLoading() {
    const LOADING_STATUS_ID = 1;
    return this.statusId === LOADING_STATUS_ID;
  }

  @computed get isLoadedWithEroors() {
    const LOAD_ERROR_STATUS_ID = 2;
    return this.statusId === LOAD_ERROR_STATUS_ID;
  }

  async cancel() {
    this.isCanceling = true;
    await this.manager.cancelSession(this);
    await this.applyData(this.manager.getSession(this.id));
    this.isCanceling = false;
  }

  applyData(data) {
    transaction(() => {
      this.id = data.id;
      this.description = data.description;
      this.devices = data.devices;
      this.packetId = data.packetId;
      this.created = data.created;
      this.updated = data.updated;
      this.statusId = data.statusId;
      this.isCancelable = data.isCancelable;
    });
  }

  constructor(data, session, manager) {
    this.session = session;
    this.manager = manager;

    this.applyData(data);
  }
}

export default Session;
