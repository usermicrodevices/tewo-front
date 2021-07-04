import { action, computed, observable } from 'mobx';
import { getBeverageIndicatorsValues } from 'services/beverage';

function getUnitFromIndicator(session, indicatorInfo) {
  const unitId = session.beverageIndicators.get(indicatorInfo.indicator)?.unit;

  return session.units.get(unitId)?.name;
}

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

  @observable
  indicators;

  get key() { return this.id; }

  constructor(session) {
    this.session = session;
  }

  @computed get indicatorsList() {
    if (!this.indicators) {
      return undefined;
    }

    return this.indicators.map((indicatorInfo) => ({
      name: this.session.beverageIndicators.get(indicatorInfo.indicator)?.name,
      value: indicatorInfo.value,
      unit: getUnitFromIndicator(this.session, indicatorInfo),
    }));
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

  @computed get salePointName() {
    const { device } = this;
    return device && device.salePointName;
  }

  @computed get companyName() {
    const { device } = this;
    const company = device && this.device.company;
    return company && company.name;
  }

  @computed get salePointId() {
    const { device } = this;
    return device && device.salePointId;
  }

  @computed get deviceName() {
    const { device } = this;
    return device && device.name;
  }

  @action fetchIndicators() {
    this.indicators = undefined;

    getBeverageIndicatorsValues(/* TODO set `this.id` when api will ready */8000000).then((indicators) => {
      this.indicators = indicators;
    });
  }
}

export default Beverage;
