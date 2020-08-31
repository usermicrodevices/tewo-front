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
import Costs from './costs';
import CostGroups from './costs/groups';

class Session {
  operations = new Operations();

  locations = new Locations();

  deviceModels = new DeviceModels();

  beverageOperations = new BeverageOperations();

  costGroups = new CostGroups();

  costs = new Costs(this);

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
