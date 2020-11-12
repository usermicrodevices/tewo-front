import { computed, observable } from 'mobx';
import Datum from 'models/datum';

class Company extends Datum {
  id;

  @observable name;

  @observable city;

  @observable emails;

  @observable phone;

  @observable contactPeople;

  @observable group;

  @observable currencyId;

  created;

  session;

  @computed get points() {
    if (!this.session.points.isLoaded) {
      return undefined;
    }
    return this.session.points.rawData.filter(({ companyId }) => companyId === this.id);
  }

  @computed get currency() {
    return this.session.currencies.get(this.currencyId);
  }

  @computed get drinks() {
    if (!this.session.drinks.isLoaded) {
      return undefined;
    }
    return this.session.drinks.rawData.filter(({ companyId }) => companyId === this.id);
  }

  @computed get pointsAmount() {
    return this.points?.length;
  }

  get key() { return this.id; }

  constructor(session) {
    super(session.companies.update);

    this.session = session;
  }

  editable = {
    name: {
      type: 'text',
      isRequired: true,
    },
    emails: {
      type: 'text',
    },
    phone: {
      type: 'phone',
    },
    contactPeople: {
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
        dataIndex: 'emails',
        title: 'E-mail',
        value: this.emails,
      },
      {
        dataIndex: 'phone',
        title: 'Телефон',
        value: this.phone,
      },
      {
        dataIndex: 'contactPeople',
        title: 'Контактное лицо',
        value: this.contactPeople,
      },
      {
        dataIndex: 'created',
        title: 'Дата внесения в базу',
        value: this.created.format('D MMMM yyyy года'),
      },
    ];
  }

  @computed get links() {
    return [
      {
        icon: 'people-outline',
        text: 'Пользователи',
        link: `/users?company=${this.id}`,
      },
      {
        icon: 'briefcase-outline',
        text: 'Объекты',
        link: `/sale_points?companyId__exact=${this.id}`,
      },
    ];
  }
}

export default Company;
