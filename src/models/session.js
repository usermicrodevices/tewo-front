import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';
import Locations from './locations';
import Events from './events';
import EventTypes from './events/types';
import Devices from './devices';
import Operations from './operations';
import Drinks from './drinks';
import Ingredients from './ingredients';

class Session {
  operations = new Operations();

  locations = new Locations();

  beverages = new Beverages(this);

  events = new Events(this);

  eventTypes = new EventTypes();

  companies = new Companies(this);

  points = new Points(this);

  devices = new Devices(this);

  drinks = new Drinks(this);

  ingredients = new Ingredients(this);
}

export default Session;
