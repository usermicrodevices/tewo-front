import Signin from 'pages/login';
import Signup from 'pages/signup';
import Dashboard from 'pages/dashboard';
import Account from 'pages/user/account';
import Notifications from 'pages/user/notifications';
import UsersList from 'pages/user/usersList';
import MapPage from 'pages/map';
import Companies from 'pages/companies';
import SalePoints from 'pages/salePoints';
import Beverage from 'pages/beverage';

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

const authorizedRoutes = [
  account,
  notifications,
  usersList,
  map,
  companies,
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
  companies,
  defaultAuthorizedRout,
  defaultUnauthorizedRout,
  unauthorizedRoutes,
  authorizedRoutes,
  salePoints,
  beverage,
  companiesSubmenu,
};
