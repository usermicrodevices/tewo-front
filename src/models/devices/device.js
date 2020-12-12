import { computed, observable } from 'mobx';
import { zones } from 'utils/timezone';

import * as routes from 'routes';
import Datum from 'models/datum';

import Details from './details';

class Device extends Datum {
  id;

  @observable name;

  controller;

  createdDate;

  setupDate;

  @observable salePointId;

  serial;

  @observable deviceModelId;

  @observable priceGroupId;

  @observable timeZone;

  @observable isOn;

  isInactive = false;

  @observable downtime;

  @observable isHasOverlocPPM;

  @observable isNeedTechService;

  @observable isHaveOverdueTasks;

  @observable priceSyncDate;

  detailsData = null;

  stopDate;

  session;

  constructor(session) {
    super(session.devices.applyDevice);

    this.session = session;

    this.editable = {
      name: {
        type: 'text',
      },
      deviceModelName: {
        type: 'selector',
        selector: this.session.deviceModels.selector,
      },
      timeZone: {
        type: 'selector',
        selector: zones.RU.map((v) => [v, v]),
      },
      salePointId: {
        type: 'selector',
        selector: this.session.points.selector,
      },
      setupDate: {
        type: 'date',
      },
      description: {
        type: 'text',
        rows: 3,
      },
      ingredients: {
        type: 'ingredients',
      },
    };
  }

  get details() {
    if (this.detailsData === null) {
      this.detailsData = new Details(this);
    }
    return this.detailsData;
  }

  @computed get path() {
    return `${routes.devices.path}/${this.id}`;
  }

  @computed get salePoint() {
    const { salePointId } = this;
    if (typeof salePointId !== 'number') {
      return salePointId;
    }
    return this.session.points.get(salePointId);
  }

  @computed get priceGroup() {
    const { priceGroupId } = this;
    if (typeof priceGroupId !== 'number') {
      return priceGroupId;
    }
    return this.session.priceGroups.get(priceGroupId);
  }

  @computed get company() {
    const { salePoint } = this;
    if (!salePoint) {
      return undefined;
    }
    return salePoint.company;
  }

  @computed get cityName() {
    const { salePoint } = this;
    return salePoint && salePoint.cityName;
  }

  @computed get companyName() {
    const { company } = this;
    return company && company.name;
  }

  @computed get companyId() {
    const { salePoint } = this;
    if (!salePoint) {
      return undefined;
    }
    return salePoint.companyId;
  }

  @computed get deviceModel() {
    if (typeof this.deviceModelId !== 'number') {
      return this.deviceModelId;
    }
    return this.session.deviceModels.get(this.deviceModelId);
  }

  @computed get deviceModelName() {
    const { deviceModel } = this;
    return deviceModel && deviceModel.name;
  }

  @computed get deviceModelType() {
    const { deviceModel } = this;
    return deviceModel && deviceModel.deviceTypeId && this.session.deviceTypes.get(deviceModel.deviceTypeId);
  }

  @computed get salePointName() {
    const { salePoint } = this;
    if (!salePoint) {
      return salePoint;
    }
    return salePoint.name;
  }

  @computed get salePointLocation() {
    const { salePoint } = this;
    if (!salePoint) {
      return salePoint;
    }
    return salePoint.location;
  }

  @computed get salePointAddress() {
    const { salePoint } = this;
    if (!salePoint) {
      return salePoint;
    }
    return salePoint.address;
  }

  @computed get priceGroupName() {
    const { priceGroup } = this;
    return priceGroup && priceGroup.name;
  }

  @computed get conceptionName() {
    const { priceGroup } = this;
    return priceGroup && priceGroup.conceptionName;
  }

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID контроллера',
        value: this.controller,
      },
      {
        dataIndex: 'serial',
        title: 'Серийный номер (Serial)',
        value: this.serial,
      },
      {
        dataIndex: 'conception',
        title: 'Концепция',
        value: this.conceptionName,
      },
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
      {
        dataIndex: 'salePointId',
        title: 'Объект',
        value: this.salePointName,
      },
      {
        dataIndex: 'timeZone',
        title: 'Временная зона (time zone)',
        value: this.timeZone,
      },
      {
        dataIndex: 'deviceModelType',
        title: 'Тип оборудования',
        value: null,
      },
      {
        dataIndex: 'deviceModelName',
        title: 'Модель',
        value: this.deviceModelName,
      },
      {
        dataIndex: 'setupDate',
        title: 'Дата монтажа',
        value: this.setupDate,
      },
      {
        dataIndex: 'description',
        title: 'Описание',
        value: null,
      },
      {
        dataIndex: 'ingredients',
        title: 'Настройка прогнозируемого пополнения ингредиентов',
        value: null,
      },
    ];
  }
}

export default Device;
