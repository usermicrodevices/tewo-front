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
import Cleans from 'pages/tech/cleans';
import Devices from 'pages/reference/devices';
import EventTypes from 'pages/reference/eventTypes';
import Events from 'pages/tech/events';
import Drinks from 'pages/reference/drink';
import Ingredients from 'pages/reference/ingredients';
import PriceList from 'pages/reference/price';

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
const notifications = new Rout('/notofications', Notifications);
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
const overdueLog = new Rout('/overdue_log', Cleans);
const eventsLog = new Rout('/events_log', Events);
const cleansLog = new Rout('/cleans_log', Cleans);
const cost = new Rout('/cost', Cleans);
const ingredientsRate = new Rout('/ingredients_rate', Cleans);
const sales = new Rout('/sales', Cleans);
const cancelationsRate = new Rout('/cancelations_rate', Cleans);
const cleansRate = new Rout('/cleans_rate', Cleans);

const authorizedRoutes = [
  account,
  notifications,
  usersList,
  map,
  cleansLog,
  overdueLog,
  eventsLog,
  cost,
  ingredientsRate,
  sales,
  cancelationsRate,
  cleansRate,
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

const companiesSubmenu = [
  {
    path: companies.path,
    text: 'Каталог',
  },
];

export {
  signup,
  signin,
  dashboard,
  account,
  notifications,
  usersList,
  map,
  cleansLog,
  overdueLog,
  eventsLog,
  cost,
  ingredientsRate,
  sales,
  cancelationsRate,
  cleansRate,
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
  companiesSubmenu,
};
