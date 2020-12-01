/* eslint-disable class-methods-use-this */
import { action, observable } from 'mobx';

import { usersList as usersListRout } from 'routes';

import { tableItemLink } from 'elements/table/trickyCells';

import Table from 'models/table';
import Filter from 'models/filters';
import User from 'models/user';

import { createGetUsers, applyUser, deleteUser } from 'services/users';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
  },
  username: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Логин',
    grow: 3,
    sortDirections: 'both',
    transform: (_, datum, width) => tableItemLink(datum.username, `${usersListRout.path}/${datum.id}`, width),
  },
  firstName: {
    isVisibleByDefault: true,
    title: 'Имя',
    grow: 3,
    sortDirections: 'both',
  },
  lastName: {
    isVisibleByDefault: true,
    title: 'Фамилия',
    grow: 3,
    sortDirections: 'both',
  },
  isActive: {
    isVisibleByDefault: true,
    title: 'Активен',
    grow: 2,
    sortDirections: 'both',
  },
  role: {
    isVisibleByDefault: true,
    title: 'Роль',
    grow: 3,
    sortDirections: 'both',
  },
  email: {
    isVisibleByDefault: true,
    title: 'Почта',
    grow: 3,
    sortDirections: 'both',
  },
  companiesNamesList: {
    isVisibleByDefault: true,
    title: 'Компании',
    grow: 3,
    sortDirections: 'both',
  },
  salePointsNamesList: {
    isVisibleByDefault: true,
    title: 'Объекты',
    grow: 3,
    sortDirections: 'both',
  },
};

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => Array.isArray(data.companies) && data.companies.some((c) => general(c)),
    selector: () => session.companies.selector,
  },
  salePointId: {
    type: 'selector',
    title: 'Объект',
    apply: (general, data) => {
      if (Array.isArray(data.salePoints) && data.salePoints.length > 0) {
        return data.salePoints.some((salePointId) => general(salePointId));
      }

      if (Array.isArray(data.companies) && data.companies.length > 0) {
        return data.session.points.getByCompanyIdSet(new Set(data.companies))?.some((sp) => general(sp.id));
      }

      return false;
    },
    selector: () => session.points.selector,
  },
  role: {
    type: 'selector',
    title: 'Роль',
    apply: (general, data) => general(data.roleId),
    selector: () => session.roles.selector,
  },
});

class Users extends Table {
  get isImpossibleToBeAsync() { return true; }

  @observable elementForEdit;

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum, push) => {
      this.elementForEdit = datum;
    },
    onDelete: (datum) => {
      deleteUser(datum.id).then(this.rawData.splice(this.rawData.findIndex((d) => d === datum), 1));
    },
  };

  constructor(session) {
    super(COLUMNS, createGetUsers(session), new Filter(declareFilters(session)));

    this.session = session;
  }

  toString() {
    return 'users';
  }

  get(userId) {
    return this.rawData.find(({ id }) => userId === id);
  }

  @action create() {
    const itm = new User(this.session);
    this.elementForEdit = itm;
    itm.onCreated = () => {
      this.rawData.push(itm);
    };
  }

  update = applyUser
}

export default Users;
