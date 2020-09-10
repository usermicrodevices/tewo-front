import { observable, computed } from 'mobx';
import Datum from 'models/datum';

import Details from './details';

class SalePoint extends Datum {
  id = null;

  @observable name = null;

  @observable address = null;

  @observable companyId = null;

  createdDate = null;

  @observable mapPoint = null;

  @observable person = null;

  @observable phone = null;

  @observable email = null;

  @observable cityId = null;

  isOutOfWaterQuality = null;

  isHaveDisabledEquipment = null;

  isNeedOverhaul = null;

  isHaveOutdatedEvents = null;

  @observable isClosed = false;

  @observable tags = [];

  session;

  detailsData;

  get details() {
    if (typeof detailsData === 'undefined') {
      this.detailsData = new Details(this.session);
    }
    return this.detailsData;
  }

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'name',
        title: 'Название объекта',
        value: this.name,
      },
      {
        dataIndex: 'isClosed',
        title: 'Объект закрыт',
        value: this.isClosed,
      },
      {
        dataIndex: 'companyId',
        title: 'Компания',
        value: this.companyName,
      },
      {
        dataIndex: 'regionName',
        title: 'Регион',
        value: this.regionName,
      },
      {
        dataIndex: 'cityId',
        title: 'Город',
        value: this.cityName,
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
        dataIndex: 'phone',
        title: 'Телефон',
        value: this.phone,
      },
      {
        dataIndex: 'person',
        title: 'Ответственный',
        value: this.person,
      },
      {
        dataIndex: 'email',
        title: 'Email',
        value: this.email,
      },
      {
        dataIndex: 'tags',
        title: 'Теги',
        value: this.tags.join(', '),
      },
    ];
  }

  get location() {
    if (typeof this.mapPoint !== 'string') {
      return null;
    }
    const location = this.mapPoint.split(',').map((v) => parseFloat(v));
    if (location.length !== 2 || isNaN(location[0]) || isNaN(location[1])) {
      return null;
    }
    return location;
  }

  @computed get editable() {
    return {
      name: {
        type: 'text',
      },
      isClosed: {
        type: 'checkbox',
      },
      address: {
        type: 'text',
      },
      companyId: {
        type: 'selector',
        selector: this.session.companies.selector,
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
      tags: {
        type: 'selector',
        isMultiple: true,
        selector: [],
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
    const { city } = this;
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
    const { companyId } = this;
    if (typeof companyId !== 'number') {
      return companyId;
    }
    return this.session.companies.get(companyId);
  }

  @computed get companyName() {
    const { company } = this;
    if (!company) {
      return company;
    }
    return company.name;
  }

  constructor(session) {
    super(session.points.applyer);

    this.session = session;
  }
}

export default SalePoint;
