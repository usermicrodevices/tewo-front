import { computed } from 'mobx';

import Details from './salesRowDetails';

class SalesRow {
  curBeverages;

  curSales;

  prwBeverages;

  prwSales;

  salePointId;

  session;

  filter;

  detailsData;

  get details() {
    if (typeof this.detailsData === 'undefined') {
      this.detailsData = new Details(this);
    }
    return this.detailsData;
  }

  @computed get detailsRowsCount() {
    if (!this.isDetailsLoaded) {
      return undefined;
    }
    return this.details.rows.length || 3;
  }

  @computed get isDetailsLoaded() {
    return this.details.isLoaded;
  }

  @computed get salePoint() {
    return this.session.points.get(this.salePointId);
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

  constructor(session, filter, salePointId, curDatum, prwDatum) {
    this.filter = filter;
    this.session = session;
    this.salePointId = salePointId;
    this.curBeverages = curDatum.beverages;
    this.curSales = curDatum.sales;
    this.prwBeverages = prwDatum.beverages;
    this.prwSales = prwDatum.sales;
  }
}

export default SalesRow;
