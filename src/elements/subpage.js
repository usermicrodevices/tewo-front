import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { SubpageHeader } from 'elements/headers';

const SubPage = withRouter(({ menu, title, match }) => (
  <>
    <SubpageHeader
      menu={menu}
    >
      {title}
    </SubpageHeader>
    <Switch>
      {
        menu.slice().sort(({ path: a }, { path: b }) => b.length - a.length).map(({ widget, path }) => (
          <Route key={path} path={typeof path === 'string' && path !== '' ? `${match.path}/${path}/` : undefined}>
            {widget}
          </Route>
        ))
      }
    </Switch>
  </>
));

export default SubPage;
