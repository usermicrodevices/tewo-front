import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import Format from 'elements/format';
import classes from './index.module.scss';

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
    render: (earn) => <Format isCost>{earn}</Format>,
    width: width[1],
    sorter: (a, b) => a.earn - b.earn,
  },
  {
    title: 'Маржа',
    dataIndex: 'margin',
    render: (margin) => <Format isCost>{margin}</Format>,
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
    render: (cost) => <Format isCost>{cost}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.cost - b.cost,
  },
  {
    title: 'Выручка',
    dataIndex: 'earn',
    render: (earn) => <Format isCost>{earn}</Format>,
    width: width[2] / 3,
    sorter: (a, b) => a.earn - b.earn,
  },
  {
    title: 'Маржа',
    dataIndex: 'margin',
    render: (margin) => <Format isCost>{margin}</Format>,
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
    title: 'Ед. изм.',
    dataIndex: 'measure',
    render: (measure) => <Format>{measure}</Format>,
  },
  {
    title: 'Кол-во на 1 порцию',
    dataIndex: 'ingredientAmount',
    render: (ingredientAmount) => <Format>{ingredientAmount}</Format>,
  },
  {
    title: 'Общее Кол-во',
    dataIndex: 'ingredientsCount',
    render: (ingredientsCount) => <Format>{ingredientsCount}</Format>,
    sorter: (a, b) => a.ingredientsCount - b.ingredientsCount,
  },
  {
    title: 'Цена ингредиента',
    dataIndex: 'ingredientCost',
    render: (ingredientCost) => <Format isCost>{ingredientCost}</Format>,
    sorter: (a, b) => a.ingredientCost - b.ingredientCost,
  },
  {
    title: 'Стоимость на порцию',
    dataIndex: 'drinkCost',
    render: (drinkCost) => (
      <Format isCost>{drinkCost}</Format>
    ),
    sorter: (a, b) => a.drinkCost - b.drinkCost,
  },
  {
    title: 'Стоимость суммарно',
    dataIndex: 'cost',
    render: (cost) => <Format isCost>{cost}</Format>,
    sorter: (a, b) => a.cost - b.cost,
  },
];

const GENERIC_EXPANDABLE = {
  rowExpandable: () => true,
  expandRowByClick: true,
  expandedRowClassName: (record, index, indent) => classes.detailschild,
  expandIcon: ({ expanded, onExpand, record }) => (
    expanded ? (
      <UpOutlined onClick={(e) => onExpand(record, e)} />
    ) : (
      <DownOutlined onClick={(e) => onExpand(record, e)} />
    )
  ),
};

const Details = ({ columnWidth, _, item }) => {
  item.setSmallScreenAffition(columnWidth.reduce((p, c) => p + c, 0) < 1250);
  return (
    <Table
      columns={columns(columnWidth)}
      dataSource={item.rows}
      pagination={false}
      className={classes.details}
      expandable={{
        expandedRowRender: ({ details: drinks, key }) => (
          <Table
            columns={drinkColumns(columnWidth)}
            dataSource={drinks}
            pagination={false}
            expandable={{
              expandedRowRender: ({ details: ingredients }) => (
                <Table
                  columns={ingredientColumns(columnWidth)}
                  dataSource={ingredients}
                  pagination={false}
                />
              ),
              onExpandedRowsChange: (expanded) => item.setExpanded(expanded, key),
              expandIconColumnIndex: 5,
              expandedRowKeys: item.expanded.get(key) || [],
              ...GENERIC_EXPANDABLE,
            }}
          />
        ),
        onExpandedRowsChange: (expanded) => item.setExpanded(expanded),
        expandIconColumnIndex: 3,
        expandedRowKeys: item.expanded.get() || [],
        ...GENERIC_EXPANDABLE,
      }}
    />
  );
};

export default observer(Details);
