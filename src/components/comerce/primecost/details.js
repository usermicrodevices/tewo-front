import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import Format from 'elements/format';

const columns = (width) => [
  {
    title: 'Объект',
    dataIndex: 'name',
    render: (name) => <Format width={width[0]}>{name}</Format>,
    width: width[0],
  },
  {
    title: 'Выручка',
    dataIndex: 'earn',
    render: (earn) => <Format>{earn}</Format>,
    width: width[1],
    sorter: (a, b) => a.earn - b.earn,
  },
  {
    title: 'Маржа',
    dataIndex: 'margin',
    render: (margin) => <Format>{margin}</Format>,
    width: width[2],
    sorter: (a, b) => a.margin - b.margin,
  },
];

const drinkColumns = (width) => [
  {
    title: 'Напиток',
    dataIndex: 'name',
    render: (name) => <Format width={width[0]}>{name}</Format>,
    width: width[0],
  },
  {
    title: 'Количество',
    dataIndex: 'ingredientsCount',
    render: (ingredientsCount) => <Format>{ingredientsCount}</Format>,
    width: width[1],
    sorter: (a, b) => a.ingredientsCount - b.ingredientsCount,
  },
  {
    title: 'Цена',
    dataIndex: 'cost',
    render: (cost) => <Format>{cost}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.cost - b.cost,
  },
  {
    title: 'Выручка',
    dataIndex: 'earn',
    render: (earn) => <Format>{earn}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.earn - b.earn,
  },
  {
    title: 'Маржа',
    dataIndex: 'margin',
    render: (margin) => <Format>{margin}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.margin - b.margin,
  },
];

const ingredientColumns = (width) => [
  {
    title: 'Ингредиент',
    dataIndex: 'name',
    render: (name) => <Format width={width[0]}>{name}</Format>,
    width: width[0],
  },
  {
    title: 'Количество',
    dataIndex: 'ingredientsCount',
    render: (ingredientsCount) => <Format>{ingredientsCount}</Format>,
    width: width[1],
    sorter: (a, b) => a.ingredientsCount - b.ingredientsCount,
  },
  {
    title: 'Цена',
    dataIndex: 'cost',
    render: (cost) => <Format>{cost}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.cost - b.cost,
  },
  {
    title: 'Выручка',
    dataIndex: 'earn',
    render: (earn) => <Format>{earn}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.earn - b.earn,
  },
  {
    title: 'Маржа',
    dataIndex: 'margin',
    render: (margin) => <Format>{margin}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.margin - b.margin,
  },
];

const expandable = (expandedRowRender, onExpandedRowsChange, expandIconColumnIndex) => ({
  expandedRowRender,
  rowExpandable: () => true,
  expandIconColumnIndex,
  expandRowByClick: true,
  indentSize: 0,
  onExpandedRowsChange,
  expandIcon: ({ expanded, onExpand, record }) => (
    expanded ? (
      <UpOutlined onClick={(e) => onExpand(record, e)} />
    ) : (
      <DownOutlined onClick={(e) => onExpand(record, e)} />
    )
  ),
});

const Details = ({ columnWidth, _, item }) => (
  <Table
    columns={columns(columnWidth)}
    dataSource={item.rows}
    pagination={false}
    expandable={expandable(
      ({ details: drinks }) => (
        <Table
          columns={drinkColumns(columnWidth)}
          dataSource={drinks}
          pagination={false}
          expandable={expandable(
            ({ details: ingredients }) => (
              <Table
                columns={ingredientColumns(columnWidth)}
                dataSource={ingredients}
                pagination={false}
              />
            ),
            (expanded) => item.setExpanded(expanded, 1),
            5,
          )}
        />
      ),
      (expanded) => item.setExpanded(expanded, 0),
      3,
    )}
  />
);

export default observer(Details);
