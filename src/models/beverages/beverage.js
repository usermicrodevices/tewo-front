import { computed } from 'mobx';

class Beverage {
  id;

  cid;

  createdDate;

  deviceId;

  deviceDate;

  drinkId;

  operationId;

  saleSum;

  canceled;

  session;

  constructor(session) {
    this.session = session;
  }

  @computed get operationName() {
    const { operationId } = this;
    if (typeof operationId !== 'number') {
      return operationId;
    }
    return this.session.beverageOperations.get(operationId);
  }

  @computed get drink() {
    const { drinkId } = this;
    if (typeof drinkId !== 'number') {
      return drinkId;
    }
    return this.session.drinks.get(drinkId);
  }

  @computed get drinkName() {
    const { drink } = this;
    return (drink || { name: undefined }).name;
  }

  @computed get device() {
    const { deviceId } = this;
    if (typeof deviceId !== 'number') {
      return deviceId;
    }
    return this.session.devices.get(deviceId);
  }

  @computed get companyId() {
    const { device } = this;
    return device ? device.companyId : device;
  }

  @computed get deviceName() {
    return (this.device || { name: undefined }).name;
  }
}

export default Beverage;
