import { computed } from 'mobx';

class SalesRow {
  curBeverages;

  curSales;

  prwBeverages;

  prwSales;

  deviceId;

  session;

  @computed get deltaSales() {
    if (this.prwSales === 0) {
      return null;
    }
    return this.curSales / this.prwSales;
  }

  @computed get deltaBeverages() {
    if (this.prwBeverages === 0) {
      return null;
    }
    return this.curBeverages / this.prwBeverages;
  }

  @computed get device() {
    return this.devices.get(this.deviceId);
  }

  @computed get salePoint() {
    const { device } = this;
    return device && device.salePoint;
  }

  @computed get salePointName() {
    const { salePoint } = this;
    return salePoint && salePoint.name;
  }

  @computed get salePointCityName() {
    const { salePoint } = this;
    return salePoint && salePoint.cityName;
  }

  @computed get id() {
    return this.deviceId;
  }

  @computed get beverages() {
    return {
      cur: this.curBeverages,
      prw: this.prwBeverages,
      delta: this.deltaBeverages,
    };
  }

  @computed get sales() {
    return {
      cur: this.curSales,
      prw: this.prwSales,
      delta: this.deltaSales,
    };
  }

  constructor(session, deviceId, curDatum, prwDatum) {
    this.session = session;
    this.deviceId = deviceId;
    this.curBeverages = curDatum.beverages;
    this.curSales = curDatum.sales;
    this.prwBeverages = prwDatum.beverages;
    this.prwSales = prwDatum.sales;
  }
}

export default SalesRow;
