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
        selector: this.session.locations.citiesSelector,
      },
    };
  }

  @computed get city() {
    if (this.cityId === null) {
      return null;
    }
    const { locations } = this.session;
    return locations.getCity(this.cityId);
  }

  @computed get cityName() {
    if (this.cityId === null) {
      return null;
    }
    const city = this.session.locations.getCity(this.cityId);
    if (city === null || (typeof city === 'undefined')) {
      return city;
    }
    return city.name;
  }

  @computed get region() {
    if (this.cityId === null) {
      return null;
    }
    const { locations } = this.session;

    const city = locations.getCity(this.cityId);
    if (typeof city === 'undefined') {
      return undefined;
    }
    return locations.getRegion(city.region);
  }

  @computed get regionName() {
    const { region } = this;
    if (region === null || (typeof region === 'undefined')) {
      return region;
    }
    return region.name;
  }

  @computed get regionId() {
    const { region } = this;
    if (region === null || (typeof region === 'undefined')) {
      return region;
    }
    return region.id;
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
