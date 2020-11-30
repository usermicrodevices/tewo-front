import { observable, computed, action } from 'mobx';

import Datum from 'models/datum';

import { applyUser } from 'services/users';

class User extends Datum {
  @observable id = null;

  @observable username = '';

  @observable email = '';

  @observable firstName = '';

  @observable lastName = '';

  @observable isActive = false;

  @observable isStaff = false;

  @observable isSuperuser = false;

  @observable permissions = [];

  @observable companies = [];

  @observable salePoints = [];

  @observable avatar = '';

  @observable contractFinished = null;

  @observable lastLogin = '';

  @observable roleId = null;

  @observable session = null;

  constructor(session) {
    super(applyUser);

    this.session = session;
  }

  @action.bound setPoint(id, checked) {
    if (checked && this.salePoints.indexOf(id) === -1) {
      this.salePoints.push(id);
    }

    if (!checked && this.salePoints.indexOf(id) > -1) {
      this.salePoints.splice(this.salePoints.indexOf(id), 1);
    }
  }

  @action.bound enableAllPoints() {
    this.salePoints.replace([]);
  }

  @computed get role() {
    if (this.session?.roles) {
      return this.session?.roles.get(this.roleId);
    }

    return undefined;
  }

  @computed get companiesNamesList() {
    return this.session?.companies.getSubset(new Set(this.companies))?.map((c) => c.name) || undefined;
  }

  @computed get salePointsNamesList() {
    return this.session?.points.getSubset(new Set(this.salePoints))?.map((sp) => sp.name) || undefined;
  }

  @computed get name() {
    const name = `${this.firstName} ${this.lastName}`;
    if (name.length > 1) {
      return name;
    }
    return this.username;
  }

  @computed get availableSalePoints() {
    return this.session?.points.getByCompanyIdSet(new Set(this.companies)) || undefined;
  }

  @computed get enabledSalePoints() {
    if (Array.isArray(this.salePoints) && this.salePoints.length > 0) {
      return this.session?.points.getSubset(new Set(this.salePoints));
    }

    return [];
  }

  @computed get salePointsTableData() {
    if (this.availableSalePoints === undefined) {
      return undefined;
    }

    const enabledSet = new Set(this.enabledSalePoints.map((sp) => sp.id));

    return this.availableSalePoints.map((sp) => ({
      id: sp.id,
      name: sp.name,
      checked: enabledSet.has(sp.id),
    }));
  }

  @computed get isAllEnabled() {
    if (this.enabledSalePoints === undefined) {
      return undefined;
    }

    return this.enabledSalePoints.length === 0;
  }

  get avatarSymbols() {
    const avatarContent = () => {
      if (this.firstName.length > 0) {
        if (this.lastName.length > 0) {
          return `${this.firstName.slice(0, 1)}${this.lastName.slice(0, 1)}`;
        }
        return this.firstName.slice(0, 2);
      }
      if (this.lastName.length > 0) {
        return this.lastName.slice(0, 2);
      }
      return this.username.slice(0, 2);
    };
    return avatarContent().toUpperCase();
  }

  @computed get values() {
    if (this.id) {
      return [
        {
          dataIndex: 'id',
          title: 'ID',
          value: this.id,
        },
        {
          dataIndex: 'username',
          title: 'Логин',
          value: this.username,
        },
        {
          dataIndex: 'roleId',
          title: 'Роль',
          value: this.role,
        },
        {
          dataIndex: 'firstName',
          title: 'Имя',
          value: this.firstName,
        },
        {
          dataIndex: 'lastName',
          title: 'Фамилия',
          value: this.lastName,
        },
        {
          dataIndex: 'email',
          title: 'Почта',
          value: this.email,
        },
        {
          dataIndex: 'companies',
          title: 'Компании',
          value: this.companiesNamesList,
        },
      ];
    }

    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'username',
        title: 'Логин',
        value: this.username,
      },
      {
        dataIndex: 'password',
        title: 'Пароль',
      },
      {
        dataIndex: 'roleId',
        title: 'Роль',
        value: this.role,
      },
      {
        dataIndex: 'firstName',
        title: 'Имя',
        value: this.firstName,
      },
      {
        dataIndex: 'lastName',
        title: 'Фамилия',
        value: this.lastName,
      },
      {
        dataIndex: 'email',
        title: 'Почта',
        value: this.email,
      },
      {
        dataIndex: 'companies',
        title: 'Компании',
        value: this.companiesNamesList,
      },
    ];
  }

  get editable() {
    const defaultFileds = {
      firstName: {
        type: 'text',
      },
      lastName: {
        type: 'text',
      },
      email: {
        type: 'text',
      },
      companies: {
        type: 'selector',
        selector: this.session.companies.selector,
        isMultiple: true,
      },
      roleId: {
        type: 'selector',
        selector: this.session.roles.selector,
        isRequired: true,
      },
    };

    const newFields = {
      username: {
        type: 'text',
        isRequired: true,
      },
      password: {
        type: 'password',
        isRequired: true,
        rules: [{ min: 8, message: 'Минимальная длина пароля – 8 символов' }],
      },
    };

    return this.id ? {
      ...defaultFileds,
    } : {
      ...defaultFileds,
      ...newFields,
    };
  }
}

export default User;
