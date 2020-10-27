import React from 'react';
import {
  Redirect, Switch, Route, withRouter,
} from 'react-router-dom';
import { Provider, inject, observer } from 'mobx-react';
import { Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import Editor from 'elements/editor';
import Card from 'elements/card';
import Loader from 'elements/loader';
import Typography from 'elements/typography';

import { ElementHeader } from './headers';

const isContains = (menu, action) => Array.isArray(menu) && menu.findIndex((v) => v === action || isContains(v, action)) >= 0;

const ViewerPage = ({
  additionalActions,
  menu,
  widget: Overview,
  storage,
  match,
  history,
  allLinkText,
  isEditable,
  isNotEditable,
}) => {
  if (!storage.isLoaded) {
    return <Loader size="large" />;
  }

  const { params: { id } } = match;
  const elementForEdit = storage.get(parseInt(id, 10));
  const path = match.url.split('/').slice(0, 3).join('/');

  if (!elementForEdit) {
    return <Redirect to={`${path}/../`} />;
  }

  const AdditionalActions = additionalActions || (() => null);
  const Header = withRouter(({ match: { params: { action } } }) => {
    const isEditing = action === 'edit';
    return (
      <ElementHeader allLinkText={allLinkText} menu={menu}>
        <Space>
          <Typography.Title level={1}>
            {elementForEdit.name}
          </Typography.Title>
          { !isEditing && !isNotEditable && <Button onClick={() => { history.push(`${path}/edit`); }} icon={<EditOutlined />} type="text" /> }
        </Space>
        <AdditionalActions />
      </ElementHeader>
    );
  });

  const overview = Overview ? (
    <Provider element={elementForEdit}>
      <Header />
      <Overview />
    </Provider>
  ) : <Redirect to={`${path}/view`} />;

  return (
    <Provider element={elementForEdit}>
      <Switch>
        <Route
          path={`${path}/:action`}
          render={({ match: { params: { action } } }) => {
            if (!isContains(menu.map(({ path: p }) => p), action)) {
              return <Redirect to={`${path}${Overview ? '' : 'view'}`} />;
            }
            if (action === 'view' || action === 'edit') {
              return (
                <>
                  <Header />
                  <Card><Editor data={elementForEdit} /></Card>
                </>
              );
            }
            return overview;
          }}
        />
        <Route>
          {overview}
        </Route>
      </Switch>
    </Provider>
  );
};

export default withRouter(inject('storage')(observer(ViewerPage)));
