import { observable, computed } from 'mobx';

class SalePoint {
  @observable id;

  @observable name;

  @observable address;

  @observable companyId;

  @observable createdDate;

  @observable mapPoint;

  session;

  @computed get company() {
    if (!this.session) {
      return undefined;
    }
    return this.session.getCompanyById(this.companyId);
  }
}

export default SalePoint;
