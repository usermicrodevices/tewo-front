import { computed, observable, transaction } from 'mobx';

class Company {
  id;

  @observable name;

  created;

  session;

  @observable isUpdating = false;

  @computed get pointsAmount() {
    if (!this.session.pointsModel.isLoaded) {
      return undefined;
    }
    return this.session.pointsModel.rawData.filter(({ companyId }) => companyId === this.id).length;
  }

  get key() { return this.id; }

  constructor(session) {
    this.session = session;
  }

  editable = {
    name: {
      type: 'text',
    },
  }

  @computed get table() {
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
        dataIndex: 'created',
        title: 'Дата внесения в базу',
        value: this.created.format('D MMMM yyyy года'),
      },
    ];
  }

  links = [
    {
      icon: 'people-outline',
      text: 'Пользователи',
      link: `/users?company=${this.id}`,
    },
    {
      icon: 'briefcase-outline',
      text: 'Объекты',
      link: `/sale_points?company=${this.id}`,
    },
  ];

  update(update) {
    let promise;
    this.isUpdating = true;
    if (this.name === update.name) {
      promise = Promise.resolve();
    } else {
      promise = new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
    return promise.then(() => {
      transaction(() => {
        this.name = update.name;
        this.isUpdating = false;
      });
    });
  }

  clone() {
    const result = new Company(this.session);
    result.id = this.id;
    result.name = this.name;
    result.created = this.created;
    return result;
  }
}

export default Company;
