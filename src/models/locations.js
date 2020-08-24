import getLocations from 'services/locations';
import { observable, computed, transaction } from 'mobx';

class Locations {
  @observable isLoading = true;

  @observable data;

  constructor() {
    getLocations().then((data) => {
      transaction(() => {
        this.isLoading = false;
        this.data = data;
      });
    });
  }

  getCity(id) {
    if (this.isLoading) {
      return undefined;
    }
    return this.data.cities.get(id) || null;
  }

  getRegion(id) {
    if (this.isLoading) {
      return undefined;
    }
    return this.data.regions.get(id) || null;
  }

  getContry(id) {
    if (this.isLoading) {
      return undefined;
    }
    return this.data.countries.get(id) || null;
  }

  @computed get cities() {
    if (this.isLoading) {
      return [];
    }
    return Array.from(this.data.cities.entries());
  }

  @computed get citiesSelector() {
    if (this.isLoading) {
      return [];
    }
    return Array.from(this.data.cities.entries()).map(([key, { name }]) => [key, name]);
  }

  @computed get regions() {
    if (this.isLoading) {
      return [];
    }
    return Array.from(this.data.regions.entries());
  }

  @computed get regionsSelector() {
    if (this.isLoading) {
      return [];
    }
    return Array.from(this.data.regions.entries()).map(([key, { name }]) => [key, name]);
  }

  @computed get countries() {
    if (this.isLoading) {
      return [];
    }
    return Array.from(this.data.countries.entries());
  }

  @computed get countriesSelector() {
    if (this.isLoading) {
      return [];
    }
    return Array.from(this.data.countries.entries()).map(([key, { name }]) => [key, name]);
  }
}

export default Locations;
