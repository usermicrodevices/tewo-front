/* eslint no-param-reassign: off */
import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  Button, Space, Menu, Dropdown, Tooltip,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import Filters from 'elements/filters';
import Icon from 'elements/icon';
import Typography from 'elements/typography';
import HTMLEntity from 'elements/htmlEntity';
import ColumnsPicker from 'elements/table/columnsPicker';

import styles from './style.module.scss';

const KEY_FOR_EMPTY_STRING = ';;;;';

const menuItemKeyFromAction = (menu, a) => {
  if (typeof a === 'undefined' || a === '') {
    return KEY_FOR_EMPTY_STRING;
  }
  for (const { path } of menu.filter(({ path: p }) => Array.isArray(p))) {
    if (path === a || path.findIndex((act) => act === a) >= 0) {
      if (typeof path[0] === 'undefined' || path[0] === '') {
        return KEY_FOR_EMPTY_STRING;
      }
      return path[0];
    }
  }
  return a;
};

const GoBack = withRouter(
  ({ history }) => {
    if (history.length === 0) {
      return null;
    }
    return (
      <Typography.Link type="secondary" onClick={history.goBack}>
        <HTMLEntity code="&#x02039;" />
        {' '}
        Назад
      </Typography.Link>
    );
  },
);

const ElementHeader = withRouter(inject('element')(observer(({
  menu,
  children,
  history,
  match,
  element: { id },
  allLinkText,
}) => {
  const { params: { action } } = match;
  const path = match.path.split('/').slice(0, 2).join('/');
  return (
    <div className={styles.head}>
      <Space size={16} className={styles.actions}>
        <GoBack />
        <Typography.Link type="secondary" onClick={() => history.push(path)}>{ allLinkText }</Typography.Link>
      </Space>
      <div className={styles.titleRow}>
        { children }
      </div>
      { menu.length > 0 && (
        <div className={styles.submenu}>
          <Menu selectedKeys={menuItemKeyFromAction(menu, action)} mode="horizontal">
            { Array.isArray(menu)
              && menu.map(({
                icon, text, path: subPath, explains,
              }) => (
                <Menu.Item key={menuItemKeyFromAction(menu, subPath)} icon={icon} theme="none">
                  <Link to={`${path}/${id}/${Array.isArray(subPath) ? subPath[0] : subPath}`}>
                    {
                      typeof explains === 'string'
                        ? (
                          <Space>
                            {text}
                            <Tooltip placement="top" title={explains}><Icon name="info-outline" /></Tooltip>
                          </Space>
                        )
                        : text
                      }
                  </Link>
                </Menu.Item>
              )) }
          </Menu>
        </div>
      )}
    </div>
  );
})));

const TableHeader = inject('table')(observer(({ title, table }) => {
  const { filter } = table;
  const { filters } = filter;
  const isHaveFilters = Object.keys(filters).length !== 0;
  const onReorder = (columns) => { table.reorderColumns(columns); };
  const onColumnsPicked = (pickedColumns) => { table.visibleColumns = pickedColumns; };
  return (
    <div className={styles.head}>
      <Space size={16} className={styles.actions}>
        <GoBack />
      </Space>
      <div className={styles.titleRow}>
        <Space>
          <Typography.Title level={1}>{title}</Typography.Title>
          { typeof table.create === 'function'
            && <Button onClick={() => { table.create(); }} icon={<Icon size={22} name="plus-circle-outline" />} type="text" /> }
        </Space>
        <Space>
          <Dropdown overlay={<ColumnsPicker onReorder={onReorder} onChange={onColumnsPicked} visibleColumns={table.visibleColumns} />} placement="bottomLeft">
            <Button icon={<Icon name="more-vertical-outline" />}>Колонки</Button>
          </Dropdown>
          { isHaveFilters && (
            <Dropdown overlay={<Filters />} placement="bottomLeft">
              <Button
                type={filter.search !== '' ? 'primary' : 'default'}
                icon={<FilterOutlined />}
              >
                Фильтрация
              </Button>
            </Dropdown>
          )}
        </Space>
      </div>
    </div>
  );
}));

export { ElementHeader, TableHeader };
