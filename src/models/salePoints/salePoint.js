import { observable, computed } from 'mobx';

class SalePoint {
  @observable id;

  @observable name;

  @observable address;

  @observable companyId;

  @observable createdDate;

  @observable mapPoint;

  @observable person;

  @observable phone;

  @observable email;

  @observable cityId;

  session;

  @computed get city() {
    if (this.cityId === null) {
      return null;
    }
    if (this.session.locationsCache instanceof Promise) {
      return undefined;
    }
    return this.session.locationsCache.cities.get(this.cityId).name;
  }

  @computed get region() {
    if (this.cityId === null) {
      return null;
    }
    if (this.session.locationsCache instanceof Promise) {
      return undefined;
    }
    const { cities, regions } = this.session.locationsCache;
    const { region } = cities.get(this.cityId);
    return regions.get(region).name;
  }

  @computed get company() {
    if (!this.session.companiesModel.isLoaded) {
      return undefined;
    }
    return (this.session.companiesModel.rawData.find(({ id }) => id === this.companyId) || { name: '-' }).name;
  }

  constructor(session) {
    this.session = session;
  }
}

export default SalePoint;
