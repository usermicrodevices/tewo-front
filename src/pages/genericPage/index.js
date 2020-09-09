import React, { useState } from 'react';
import {
  withRouter, Redirect, Switch, Route, Link,
} from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';
import {
  Button, Space, Dropdown, Menu, Tooltip,
} from 'antd';
import { FilterOutlined, EditOutlined } from '@ant-design/icons';

import Icon from 'elements/icon';
import Editor from 'elements/editor';
import Card from 'elements/card';
import Loader from 'elements/loader';
import ColumnsPicker from 'elements/table/columnsPicker';

import GenericTablePage from './tablePage';
import styles from './style.module.scss';

const GenericPage = ({
  isNotEditable,
  refreshInterval,
  storageName,
  tableTitle,
  overview: Overview,
  overviewActions,
  overviewSubmenu,
  session,
  location,
  match: { path },
  history,
}) => {
  console.assert(typeof storageName === 'string', `Не задан storage для ${path}`);
  const OverviewActions = typeof overviewActions === 'undefined' ? () => null : overviewActions;
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const storage = session[storageName];
  if (!storage.isLoaded) {
    return <Loader size="huge" />;
  }
  const { filter, visibleColumns } = storage;
  const { filters } = filter;
  const isHaveFilters = Object.keys(filters).length !== 0;
  const isNeedToRedirect = location.search.slice(1) !== filter.search;
  const onColumnsPicked = (pickedColumns) => { storage.visibleColumns = pickedColumns; };
  const onReorder = (columns) => { storage.reorderColumns(columns); };

  const goBack = <Button onClick={history.goBack} className={styles.goback} icon={<Icon name="arrow-ios-back-outline" />} type="text">Назад</Button>;

  const TableHeader = () => (
    <div className={styles.head}>
      {goBack}
      <div className={styles.titleRow}>
        <h1>
          <Space>
            {tableTitle}
            { typeof storage.create === 'function'
            && <Button onClick={() => { storage.create(); }} icon={<Icon size={22} name="plus-circle-outline" />} type="text" /> }
          </Space>
        </h1>
        <Space>
          <Dropdown overlay={<ColumnsPicker onReorder={onReorder} onChange={onColumnsPicked} visibleColumns={visibleColumns} />} placement="bottomRight">
            <Button icon={<Icon name="more-vertical-outline" />}>Колонки</Button>
          </Dropdown>
          { isHaveFilters && (
            <Button
              type={isFiltersOpen ? 'primary' : 'default'}
              icon={<FilterOutlined />}
              onClick={() => setFiltersOpen(!isFiltersOpen)}
            >
              Фильтрация
            </Button>
          )}
        </Space>
      </div>
    </div>
  );

  const menuItemKeyFromAction = (a) => {
    if (typeof a === 'undefined' || a === '') {
      return '/overview';
    }
    if (a === 'edit' || a === 'view') {
      return 'edit';
    }
    return a;
  };

  const ElementHeader = ({
    title, isEdditing, id, action,
  }) => (
    <div className={styles.head}>
      <Space>
        {goBack}
        <Button onClick={() => history.push(path)} className={styles.goback} type="text">Все объекты</Button>
      </Space>
      <div className={styles.titleRow}>
        <h1>
          <Space>
            {title}
            { !isNotEditable && !isEdditing && <Button onClick={() => { history.push(`${path}/${id}/edit`); }} icon={<EditOutlined />} type="text" /> }
          </Space>
        </h1>
        <OverviewActions />
      </div>
      <div className={styles.submenu}>
        <Menu selectedKeys={menuItemKeyFromAction(action)} mode="horizontal">
          { Array.isArray(overviewSubmenu)
            && overviewSubmenu.map(({
              icon, text, path: subPath, explains,
            }) => (
              <Menu.Item key={menuItemKeyFromAction(subPath)} icon={icon} theme="none">
                <Link to={`${path}/${id}/${subPath}`}>
                  {
                    typeof explains === 'string'
                      ? (
                        <Space>
                          {text}
                          <Tooltip placement="top" title={text}><Icon name="info-outline" /></Tooltip>
                        </Space>
                      )
                      : text
                    }
                </Link>
              </Menu.Item>
            )) }
        </Menu>
      </div>
    </div>
  );

  return (
    <Provider storage={storage} filter={filter}>
      <Switch>
        { !isNotEditable && (
          <Route
            path={`${path}/:id/:action`}
            render={({ match: { params: { id, action } } }) => {
              const elementForEdit = storage.get(parseInt(id, 10));
              if (!elementForEdit) {
                return <Redirect path={path} />;
              }
              if (action !== 'edit' && action !== 'view') {
                return <Redirect to={`${path}/${id}`} />;
              }
              return (
                <Provider element={elementForEdit}>
                  <ElementHeader title={elementForEdit.name} id={id} action={action} isEdditing={action === 'edit'} />
                  <Card><Editor data={elementForEdit} /></Card>
                </Provider>
              );
            }}
          />
        )}
        { !isNotEditable && (
          <Route
            path={`${path}/:id`}
            render={({ match: { params: { id } } }) => {
              const elementForEdit = storage.get(parseInt(id, 10));
              if (!elementForEdit) {
                return <Redirect to={path} />;
              }
              if (typeof Overview === 'undefined') {
                return <Redirect to={`${path}/${id}/view`} />;
              }
              return (
                <Provider element={elementForEdit}>
                  <ElementHeader title={elementForEdit.name} id={id} />
                  <Overview />
                </Provider>
              );
            }}
          />
        )}
        <Route>
          { isNeedToRedirect && <Redirect to={`${path}?${filter.search}`} /> }
          <Provider table={storage}>
            <TableHeader />
            <GenericTablePage refreshInterval={refreshInterval} isFiltersOpen={isFiltersOpen} />
          </Provider>
        </Route>
      </Switch>
    </Provider>
  );
};

export default withRouter(inject('session')(observer(GenericPage)));
