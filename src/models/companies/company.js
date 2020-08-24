import { computed, observable } from 'mobx';
import Datum from 'models/datum';

class Company extends Datum {
  id;

  @observable name;

  created;

  session;

  @computed get pointsAmount() {
    if (!this.session.pointsModel.isLoaded) {
      return undefined;
    }
    return this.session.pointsModel.rawData.filter(({ companyId }) => companyId === this.id).length;
  }

  get key() { return this.id; }

  constructor(session) {
    super(() => new Promise((resolve) => {
      setTimeout(resolve, 2000);
    }));

    this.session = session;
  }

  editable = {
    name: {
      type: 'text',
    },
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
}

export default Company;
