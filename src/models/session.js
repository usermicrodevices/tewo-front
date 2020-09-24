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
import DeviceModels from './devices/models';
import BeverageOperations from './beverages/operations';
import Price from './price';
import PriceGroups from './price/groups';

class Session {
  operations = new Operations();

  locations = new Locations();

  deviceModels = new DeviceModels();

  beverageOperations = new BeverageOperations();

  eventTypes = new EventTypes();

  priceGroups = new PriceGroups();

  prices = new Price(this);

  beverages = new Beverages(this);

  events = new Events(this);

  companies = new Companies(this);

  points = new Points(this);

  devices = new Devices(this);

  drinks = new Drinks(this);

  ingredients = new Ingredients(this);
}

export default Session;
