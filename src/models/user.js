import { observable, computed } from 'mobx';

import Datum from 'models/datum';

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
    super(() => {});

    this.session = session;
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

  get name() {
    const name = `${this.firstName} ${this.lastName}`;
    if (name.length > 1) {
      return name;
    }
    return this.username;
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
          dataIndex: 'role',
          title: 'Роль',
          value: this.roleId,
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
          dataIndex: 'companies',
          title: 'Компании',
          value: this.companies,
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
        dataIndex: 'role',
        title: 'Роль',
        value: this.roleId,
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
        dataIndex: 'companies',
        title: 'Компании',
        value: this.companies,
      },
    ];
  }

  get editable() {
    const defaultFileds = {
      username: {
        type: 'text',
        isRequired: true,
      },
      firstName: {
        type: 'text',
      },
      lastName: {
        type: 'text',
      },
      companies: {
        type: 'selector',
        selector: this.session.companies.selector,
        isMultiple: true,
      },
      role: {
        type: 'selector',
        selector: this.session.roles.selector,
      },
    };

    const newFields = {
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
