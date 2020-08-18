import { computed } from 'mobx';

class Comnpany {
  id;

  name;

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
    this.session = session;
  }
}

export default Comnpany;
