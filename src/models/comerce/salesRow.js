import { computed } from 'mobx';

import Details from './salesRowDetails';

class SalesRow {
  curBeverages;

  curSales;

  prwBeverages;

  prwSales;

  deviceId;

  session;

  detailsData;

  get details() {
    if (typeof this.detailsData === 'undefined') {
      this.detailsData = new Details(this);
    }
    return this.detailsData;
  }

  @computed get isDetailsLoaded() {
    return this.details.isLoaded;
  }

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
    return this.session.devices.get(this.deviceId);
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
    };
  }

  @computed get sales() {
    return {
      cur: this.curSales / 100,
      prw: this.prwSales / 100,
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
