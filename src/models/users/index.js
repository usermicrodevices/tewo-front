/* eslint-disable class-methods-use-this */
import { action, observable } from 'mobx';

import Table from 'models/table';
import Filter from 'models/filters';
import User from 'models/user';

import { createGetUsers } from 'services/users';

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

    },
  };

  constructor(session) {
    super(COLUMNS, createGetUsers(session), new Filter(declareFilters(session)));

    this.session = session;
  }

  toString() {
    return 'users';
  }

  @action create() {
    const itm = new User(this.session);
    this.elementForEdit = itm;
    itm.onCreated = () => {
      this.rawData.push(itm);
    };
  }
}

export default Users;
