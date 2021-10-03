import { computed, observable, transaction } from 'mobx';

class Session {
  session;

  manager;

  @observable id;

  @observable description;

  devices = observable.array();

  @observable packetId;

  @observable created;

  @observable updated;

  @observable statusId;

  @observable isCanceling = false;

  @computed get devicesId() {
    return new Set(this.devices.map(({ id }) => id));
  }

  @computed get devicesList() {
    if (!this.session.devices.isLoaded) {
      return undefined;
    }
    return this.devices.map(({ deviceId }) => this.session.devices.get(deviceId)).filter(Boolean);
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

  @computed get isCancelable() {
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
    const DEVICE_LOADING_STATUS_NAME = 'progress';
    return this.devices.filter(({ statusId }) => {
      const status = this.manager.deviceStatuses.get(statusId);
      return status?.statusText !== DEVICE_LOADING_STATUS_NAME;
    }).length;
  }

  @computed get devicesCount() {
    return this.devices.length;
  }

  @computed get progress() {
    return this.isLoading ? this.devicesReadyCount / this.devicesCount * 100 : 100;
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
    await this.reload();
    this.isCanceling = false;
  }

  async cancelDevice(id) {
    this.isCanceling = true;
    await this.manager.cancelDevice(id);
    this.applyData(await this.manager.getSession(this.id));
    await this.reload();
    this.isCanceling = false;
  }

  async restart() {
    await this.manager.restartSession(this.id);
    await this.reload();
  }

  async reload() {
    this.applyData(await this.manager.getSession(this.id));
  }

  applyData(data) {
    transaction(() => {
      this.id = data.id;
      this.description = data.description;
      this.devices.replace(data.devices);
      this.packetId = data.packetId;
      this.created = data.created;
      this.updated = data.updated;
      this.statusId = data.statusId;
    });
  }

  constructor(data, session, manager) {
    this.session = session;
    this.manager = manager;

    this.applyData(data);
  }
}

export default Session;
