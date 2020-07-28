import { observable, computed } from 'mobx';

class SalePoint {
  @observable id;

  @observable name;

  @observable address;

  @observable companyId;

  @observable createdDate;

  @observable mapPoint;

  @observable session;

  @computed get company() {
    if (!this.session) {
      return null;
    }
    return this.session.getCompanyById(this.companyId);
  }
}

export default SalePoint;
