import { observable, computed, transaction } from 'mobx';
import Datum from 'models/datum';

class SalePoint extends Datum {
  id;

  @observable name;

  @observable address;

  @observable companyId;

  createdDate;

  @observable mapPoint;

  @observable person;

  @observable phone;

  @observable email;

  @observable cityId;

  session;

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
      {
        dataIndex: 'phone',
        title: 'Телефон',
        value: this.phone,
      },
      {
        dataIndex: 'email',
        title: 'Email',
        value: this.email,
      },
      {
        dataIndex: 'cityId',
        title: 'Город',
        value: this.city,
      },
      {
        dataIndex: 'address',
        title: 'Адрес',
        value: this.address,
      },
      {
        dataIndex: 'mapPoint',
        title: 'Локация',
        value: this.mapPoint,
      },
      {
        dataIndex: 'companyId',
        title: 'Компания',
        value: this.company,
      },
      {
        dataIndex: 'createdDate',
        title: 'Время внесения в базу',
        value: this.createdDate.format('D MMMM yyyy года'),
      },
      {
        dataIndex: 'person',
        title: 'Ответственный',
        value: this.person,
      },
    ];
  }

  @computed get editable() {
    return {
      name: {
        type: 'text',
      },
      address: {
        type: 'text',
      },
      companyId: {
        type: 'selector',
        selector: this.session.companiesModel.selector,
      },
      mapPoint: {
        type: 'location',
      },
      person: {
        type: 'text',
      },
      phone: {
        type: 'text',
      },
      email: {
        type: 'email',
      },
      cityId: {
        type: 'selector',
        selector: this.session.cities.map(([uid, { name }]) => [uid, name]),
      },
    };
  }

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
    return (this.session.companiesModel.rawData.find(({ id }) => id === this.companyId) || { name: undefined }).name;
  }

  constructor(session) {
    super(() => new Promise((resolve) => {
      setTimeout(resolve, 2000);
    }));

    this.session = session;
  }
}

export default SalePoint;
