import { computed, observable } from 'mobx';
import { zones } from 'utils/timezone';

import Details from './details';

class Device {
  id;

  @observable name;

  controller;

  createdDate;

  setupDate;

  salePointId;

  serial;

  @observable deviceModelId;

  priceGroupId;

  @observable timeZone;

  isOn;

  isInactive;

  downtime;

  isHasOverlocPPM;

  isNeedTechService;

  isHaveOverdueTasks;

  detailsData = null;

  stopDate;

  session;

  constructor(session) {
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

  @computed get deviceModelName() {
    if (typeof this.deviceModelId !== 'number') {
      return this.deviceModelId;
    }
    const deviceModel = this.session.deviceModels.get(this.deviceModelId);
    return deviceModel ? deviceModel.name : deviceModel;
  }

  @computed get companyId() {
    const { salePoint } = this;
    if (!salePoint) {
      return undefined;
    }
    return salePoint.companyId;
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
    if (!priceGroup) {
      return priceGroup;
    }
    return priceGroup.name;
  }

  update(data) {
    return this.session.devices.applyDevice(this.id, data);
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
        value: null,
      },
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
      {
        dataIndex: 'salePoint',
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
