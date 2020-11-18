import Signin from 'pages/login';
import Signup from 'pages/signup';
import Dashboard from 'pages/dashboard';
import Account from 'pages/user/account';
import Notifications from 'pages/user/notifications';
import UsersList from 'pages/user/usersList';
import MapPage from 'pages/map';
import Companies from 'pages/reference/companies';
import SalePoints from 'pages/reference/salePoints';
import Beverage from 'pages/tech/beverage';
import Clearances from 'pages/tech/clearances';
import Devices from 'pages/reference/devices';
import EventTypes from 'pages/reference/eventTypes';
import Events from 'pages/tech/events';
import Downtime from 'pages/tech/downtime';
import Drinks from 'pages/reference/drink';
import Ingredients from 'pages/reference/ingredients';
import PriceList from 'pages/reference/price';
import Sales from 'pages/comerce/sales';

class Rout {
  path;

  component;

  isExact;

  constructor(path, component, isExact) {
    this.path = path;
    this.component = component;
    this.isExact = typeof isExact === 'undefined' ? false : isExact;
  }
}

const signup = new Rout('/signup', Signup);
const signin = new Rout('/signin', Signin);

const unauthorizedRoutes = [signup, signin];

const dashboard = new Rout('/', Dashboard, true);
const account = new Rout('/account', Account);
const notifications = new Rout('/notifications', Notifications);
const usersList = new Rout('/userlist', UsersList);
const map = new Rout('/map', MapPage);
const companies = new Rout('/companies', Companies);
const salePoints = new Rout('/sale_points', SalePoints);
const beverage = new Rout('/beverage', Beverage);
const devices = new Rout('/devices', Devices);
const drink = new Rout('/drink', Drinks);
const ingredients = new Rout('/ingredients', Ingredients);
const priceList = new Rout('/pricegroups', PriceList);
const eventTypes = new Rout('/events', EventTypes);
const downtimeLog = new Rout('/downtime_log', Downtime);
const eventsLog = new Rout('/events_log', Events);
const cleansLog = new Rout('/cleans_log', Clearances);
const sales = new Rout('/sales', Sales);

const authorizedRoutes = [
  sales,
  account,
  notifications,
  usersList,
  map,
  cleansLog,
  downtimeLog,
  eventsLog,
  eventsLog,
  companies,
  devices,
  drink,
  ingredients,
  priceList,
  eventTypes,
  salePoints,
  beverage,
  dashboard,
];

const defaultAuthorizedRout = dashboard;

const defaultUnauthorizedRout = signin;

export {
  signup,
  signin,
  dashboard,
  sales,
  account,
  notifications,
  usersList,
  map,
  cleansLog,
  downtimeLog,
  eventsLog,
  companies,
  devices,
  drink,
  ingredients,
  priceList,
  eventTypes,
  salePoints,
  defaultAuthorizedRout,
  defaultUnauthorizedRout,
  unauthorizedRoutes,
  authorizedRoutes,
  beverage,
};
