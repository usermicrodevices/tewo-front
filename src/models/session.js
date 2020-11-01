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
import DeviceTypes from './devices/types';
import BeverageOperations from './beverages/operations';
import Prices from './price';
import PriceGroups from './price/groups';

class Session {
  operations = new Operations();

  locations = new Locations();

  deviceModels = new DeviceModels();

  deviceTypes = new DeviceTypes();

  beverageOperations = new BeverageOperations();

  eventTypes = new EventTypes();

  priceGroups = new PriceGroups(this);

  prices = new Prices(this);

  beverages = new Beverages(this);

  events = new Events(this);

  companies = new Companies(this);

  points = new Points(this);

  devices = new Devices(this);

  drinks = new Drinks(this);

  ingredients = new Ingredients(this);
}

export default Session;
