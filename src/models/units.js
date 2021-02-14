import getUnits from 'services/units';

class Units extends Map {
  constructor() {
    super();

    getUnits(this);
  }
}

export default Units;
