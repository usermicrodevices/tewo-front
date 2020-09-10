import React from 'react';
import {
  withRouter, Redirect, Switch, Route,
} from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';

import GenericTablePage from './tablePage';
import OverviewPage from './overviewPage';

const GenericPage = ({
  isHaveNotOverview,
  refreshInterval,
  storageName,
  tableTitle,
  overview,
  overviewActions,
  overviewSubmenu,
  session,
  location,
  match: { path },
}) => {
  console.assert(typeof storageName === 'string', `Не задан storage для ${path}`);
  const storage = session[storageName];
  const { filter } = storage;
  const isNeedToRedirect = location.search.slice(1) !== filter.search;

  return (
    <Provider storage={storage} filter={filter}>
      <Switch>
        { !isHaveNotOverview && (
          <Route path={`${path}/:id`}>
            <OverviewPage
              additionalActions={overviewActions}
              menu={overviewSubmenu}
              widget={overview}
            />
          </Route>
        )}
        <Route>
          { isNeedToRedirect && <Redirect to={`${path}?${filter.search}`} /> }
          <Provider table={storage}>
            <GenericTablePage refreshInterval={refreshInterval} title={tableTitle} />
          </Provider>
        </Route>
      </Switch>
    </Provider>
  );
};

export default withRouter(inject('session')(observer(GenericPage)));
