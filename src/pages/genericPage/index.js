import React, { useState } from 'react';
import {
  withRouter, Redirect, Switch, Route,
} from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';
import { Button, Space, Dropdown } from 'antd';
import { FilterOutlined, EditOutlined } from '@ant-design/icons';

import Icon from 'elements/icon';
import Editor from 'elements/editor';
import Card from 'elements/card';
import Loader from 'elements/loader';
import ColumnsPicker from 'elements/table/columnsPicker';

import GenericTablePage from './tablePage';
import styles from './style.module.scss';

const GenericPage = ({
  session,
  storageName,
  isNotEditable,
  tableTitle,
  match: { path },
  history,
  isNotAddable,
  location,
  overview: Overview,
  submenu,
  overviewActions,
}) => {
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
            { !isNotAddable && <Button onClick={() => { session.points.create(); }} icon={<Icon size={22} name="plus-circle-outline" />} type="text" /> }
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

  const ElementHeader = ({ onEdit, title, isEdditing }) => (
    <div className={styles.head}>
      {goBack}
      <div className={styles.titleRow}>
        <h1>
          <Space>
            {title}
            { !isNotAddable && !isEdditing && <Button onClick={onEdit} icon={<EditOutlined />} type="text" /> }
          </Space>
        </h1>
        {overviewActions}
      </div>
      {submenu}
    </div>
  );

  return (
    <>
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
                  <>
                    <ElementHeader title={elementForEdit.name} onEdit={() => { history.push(`${path}/${id}/edit`); }} isEdditing={action === 'edit'} />
                    <Card><Editor data={elementForEdit} /></Card>
                  </>
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
                return (
                  <>
                    <ElementHeader title={elementForEdit.name} onEdit={() => { history.push(`${path}/${id}/edit`); }} />
                    <Overview />
                  </>
                );
              }}
            />
          )}
          <Route>
            { isNeedToRedirect && <Redirect to={`${path}?${filter.search}`} /> }
            <Provider table={storage}>
              <TableHeader />
              <GenericTablePage isFiltersOpen={isFiltersOpen} />
            </Provider>
          </Route>
        </Switch>
      </Provider>
    </>
  );
};

export default withRouter(inject('session')(observer(GenericPage)));
