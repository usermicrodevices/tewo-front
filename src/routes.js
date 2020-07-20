import Signin from 'pages/login';
import Signup from 'pages/signup';
import Dashboard from 'pages/dashboard';

class Rout {
  path;

  component;

  isAuthRequired;

  isExact;

  constructor(path, component, isAuthRequired, isExact) {
    this.path = path;
    this.component = component;
    this.isAuthRequired = typeof isAuthRequired === 'undefined' ? true : isAuthRequired;
    this.isExact = typeof isExact === 'undefined' ? false : isExact;
  }
}

const routes = {
  signup: new Rout('/signup', Signup, false),
  signin: new Rout('/signin', Signin, false),

  dashboard: new Rout('/', Dashboard, true, true),
};

function splitRoutesByAuthSide(isAuthorized) {
  return Object.values(routes).filter(({ isAuthRequired }) => isAuthRequired === isAuthorized);
}

const unauthorizedRoutes = splitRoutesByAuthSide(false);

const authorizedRoutes = splitRoutesByAuthSide(true);

const defaultAuthorizedRout = routes.dashboard;

const defaultUnauthorizedRout = routes.signin;

export {
  defaultAuthorizedRout,
  defaultUnauthorizedRout,
  unauthorizedRoutes,
  authorizedRoutes,
  routes as default,
};
