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

import { ElementHeader } from './headers';

const ViewerPage = ({
  additionalActions,
  menu,
  widget: Overview,
  storage,
  match,
  history,
}) => {
  if (!storage.isLoaded) {
    return <Loader size="huge" />;
  }

  const { params: { id } } = match;
  const elementForEdit = storage.get(parseInt(id, 10));
  const path = match.url.split('/').slice(0, 3).join('/');

  if (!elementForEdit) {
    return <Redirect to={`${path}/../`} />;
  }

  const AdditionalActions = additionalActions || (() => null);
  const Header = withRouter(({ match: { params: { action } } }) => {
    const isEdditing = action === 'edit';
    return (
      <ElementHeader menu={menu}>
        <h1>
          <Space>
            {elementForEdit.name}
            { !isEdditing && <Button onClick={() => { history.push(`${path}/edit`); }} icon={<EditOutlined />} type="text" /> }
          </Space>
        </h1>
        <AdditionalActions />
      </ElementHeader>
    );
  });

  return (
    <Provider element={elementForEdit}>
      <Switch>
        <Route
          path={`${path}/:action`}
          render={({ match: { params: { action } } }) => {
            if (action !== 'edit' && action !== 'view') {
              return <Redirect to={path} />;
            }
            return (
              <>
                <Header />
                <Card><Editor data={elementForEdit} /></Card>
              </>
            );
          }}
        />
        <Route render={() => {
          if (typeof Overview === 'undefined') {
            return <Redirect to={`${path}/view`} />;
          }

          return (
            <Provider element={elementForEdit}>
              <Header />
              <Overview />
            </Provider>
          );
        }}
        />
      </Switch>
    </Provider>
  );
};

export default withRouter(inject('storage')(observer(ViewerPage)));
