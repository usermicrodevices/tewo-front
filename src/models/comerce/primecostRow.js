import { computed } from 'mobx';

class PrimeCostRow {
  session;

  cityId;

  data;

  constructor(cityId, data, session) {
    this.session = session;
    this.cityId = cityId;
    this.data = data;
  }

  get id() {
    return this.cityId;
  }

  @computed get city() {
    return this.session.locations.getCity(this.cityId);
  }

  @computed get cityName() {
    const { city } = this;
    return city && city.name;
  }

  @computed get earn() {
    let sum = 0;
    for (const ingredients of Object.values(this.data)) {
      for (const drinks of Object.values(ingredients)) {
        for (const { earn } of Object.values(drinks)) {
          sum += earn;
        }
      }
    }
    return sum;
  }

  @computed get cost() {
    let sum = 0;
    for (const ingredients of Object.values(this.data)) {
      for (const drinks of Object.values(ingredients)) {
        for (const { cost } of Object.values(drinks)) {
          sum += cost;
        }
      }
    }
    return sum;
  }

  @computed get margin() {
    return this.earn - this.cost;
  }
}

export default PrimeCostRow;
