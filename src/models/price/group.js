import { action, computed, observable } from 'mobx';
import moment from 'moment';

import Datum from 'models/datum';

class PriceGroup extends Datum {
  @observable name = null;

  @observable companyId;

  @observable conceptionId = null;

  @observable systemKey;

  @observable devicesIdSet = observable.set();

  @observable pricesIdSet = observable.set();

  @observable id = null;

  @observable selectedSync = new Set();

  @observable lastUpdate = moment();

  session;

  constructor(session) {
    super(session.priceGroups.update);

    this.session = session;
  }

  get dump() {
    return {
      id: this.id,
      name: this.name,
      companyId: this.companyId,
      conceptionId: this.conception,
      systemKey: this.systemKey,
      devicesIdSet: new Set([...this.devicesIdSet.values()]),
      pricesIdSet: new Set([...this.pricesIdSet.values()]),
    };
  }

  @computed get isSynchronized() {
    return this.devicesIdSet.size === 0;
  }

  @computed get devices() {
    return this.session.devices.getBySet(this.devicesIdSet);
  }

  @computed get company() {
    return this.session.companies.get(this.companyId);
  }

  @computed get currency() {
    return this.company?.currency;
  }

  @computed get companyName() {
    return this.company?.name;
  }

  @computed get prices() {
    return this.session.prices.getBySet(this.pricesIdSet);
  }

  @computed get drinks() {
    return this.prices?.map((price) => price.drink);
  }

  @computed get drinksCount() {
    return this.pricesIdSet.size;
  }

  @action addPrices(aditionlDrinks) {
    return this.update(this.dump, aditionlDrinks, this.session);
  }

  @action addDevices(devices) {
    const { dump } = this;
    for (const drink of devices) {
      dump.devicesIdSet.add(drink);
    }
    return this.update(dump);
  }

  @action removePrice(priceId) {
    return this.session.prices.remove(priceId).then(() => {
      this.pricesIdSet.delete(priceId);
    });
  }

  @action removeDevice(device) {
    const { dump } = this;
    dump.devicesIdSet.delete(device);
    return this.update(dump);
  }

  @action synchronize() {
    const now = moment();
    return this.session.priceGroups.synchronize(this.id, this.selectedSync).then(() => {
      for (const deviceId of this.selectedSync.values()) {
        this.session.devices.get(deviceId).priceSyncDate = now;
      }
      this.selectedSync = new Set();
    });
  }

  @computed get conception() {
    return this.session.сonceptions.get(this.conceptionId);
  }

  @computed get conceptionName() {
    return this.conception.name;
  }

  @computed get conceptionExtPLU() {
    return this.conception.extPLU;
  }

  @computed get editable() {
    return {
      name: {
        type: 'text',
        isRequired: true,
      },
      companyId: {
        type: 'selector',
        selector: this.session.companies.selector,
        isRequired: true,
      },
      conceptionId: {
        type: 'selector',
        selector: this.session.сonceptions.selector,
      },
    };
  }

  @computed get values() {
    return [
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
      {
        dataIndex: 'companyId',
        title: 'Компания',
        value: this.companyName,
      },
      {
        dataIndex: 'conceptionId',
        title: 'Концепция',
        value: this.conceptionName,
      },
    ];
  }
}

export default PriceGroup;
