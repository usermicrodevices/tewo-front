import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';
import Locations from './locations';
import Events from './events';
import EventTypes from './events/types';
import EventPriorities from './events/priorities';
import Devices from './devices';
import Operations from './operations';
import Drinks from './drinks';
import Ingredients from './ingredients';
import Users from './users';
import Roles from './users/roles';
import Mailings from './mailings';
import PersonalNotifications from './notifications/personal';
import NotificationTypes from './notifications/types';
import NotificationSources from './notifications/sources';
import DeviceModels from './devices/models';
import DeviceTypes from './devices/types';
import BeverageOperations from './beverages/operations';
import Prices from './price';
import PriceGroups from './price/groups';
import Currencies from './currencies';
import NDS from './nds';
import Conceptions from './conceptions';
import DashboardModel from './dashboard';

class Session {
  operations = new Operations();

  locations = new Locations();

  currencies = new Currencies();

  deviceModels = new DeviceModels();

  deviceTypes = new DeviceTypes();

  сonceptions = new Conceptions();

  nds = new NDS();

  beverageOperations = new BeverageOperations();

  eventPriorities = new EventPriorities();

  eventTypes = new EventTypes(this);

  priceGroups = new PriceGroups(this);

  prices = new Prices(this);

  beverages = new Beverages(this);

  events = new Events(this);

  companies = new Companies(this);

  points = new Points(this);

  devices = new Devices(this);

  drinks = new Drinks(this);

  ingredients = new Ingredients(this);

  users = new Users(this);

  roles = new Roles(this);

  mailings = new Mailings(this);

  notificationSources = new NotificationSources(this);

  notificationTypes = new NotificationTypes(this);

  personalNotifications = new PersonalNotifications(this);

  dashboard = new DashboardModel('dashboard', this);
}

export default Session;
