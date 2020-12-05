import { computed } from 'mobx';

class IngredientsRow {
  id;

  details;

  session;

  constructor(id, details, session) {
    this.id = id;
    this.details = details;
    this.session = session;
  }
}

export default IngredientsRow;
