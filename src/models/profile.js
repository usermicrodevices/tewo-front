/* eslint-disable class-methods-use-this */
import { computed } from 'mobx';

import User from 'models/users/user';

class Profile extends User {
  constructor(session) {
    super(session);

    this.session = session;
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
    return [
      {
        dataIndex: 'username',
        title: 'Логин',
        value: this.username,
      },
      {
        dataIndex: 'role',
        title: 'Роль',
        value: this.role,
      },
      {
        dataIndex: 'companies',
        title: 'Компании',
        value: this.companiesNamesList,
      },
      {
        dataIndex: 'contractFinished',
        title: 'Дата завершения лицензии',
        value: this.contractFinished,
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
    ];
  }

  get editable() {
    return {
      firstName: {
        type: 'text',
      },
      lastName: {
        type: 'text',
      },
      email: {
        type: 'text',
      },
    };
  }
}

export default Profile;
