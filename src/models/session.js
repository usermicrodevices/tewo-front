import { observable } from 'mobx';

import Beverages from './beverages';
import Companies from './companies';
import Points from './salePoints';
import SalePointsStatuses from './salePoints/statuses';
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
import BeverageIndicators from './beverages/indicators';
import Prices from './price';
import PriceGroups from './price/groups';
import Currencies from './currencies';
import NDS from './nds';
import Conceptions from './conceptions';
import DashboardModel from './dashboard';
import Units from './units';
import Permissions from './permissions';
import Tags from './tags';

class Session {
  @observable user = null; // will set in AuthorizedRouter

  tags = new Tags();

  operations = new Operations();

  units = new Units();

  locations = new Locations();

  currencies = new Currencies();

  deviceModels = new DeviceModels();

  deviceTypes = new DeviceTypes();

  сonceptions = new Conceptions();

  nds = new NDS();

  permissions = new Permissions();

  beverageOperations = new BeverageOperations();

  beverageIndicators = new BeverageIndicators();

  eventPriorities = new EventPriorities();

  eventTypes = new EventTypes(this);

  priceGroups = new PriceGroups(this);

  prices = new Prices(this);

  beverages = new Beverages(this);

  events = new Events(this);

  companies = new Companies(this);

  points = new Points(this);

  pointsStatuses = new SalePointsStatuses(this);

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
