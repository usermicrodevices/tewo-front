import React from 'react';
import { observer } from 'mobx-react';
import {
  Table, Button, InputNumber, Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Icon from 'elements/icon';

import Format from 'elements/format';
import NoData from 'elements/table/noData';

import style from './style.module.scss';

const { Option } = Select;

const RecipeEditroTable = ({ data, isEdditing }) => {
  const ds = data.ingredients.map(({
    id: ingredientId, amount, ingredient, selector,
  }, index) => ({
    id: index + 1,
    ingredientId,
    name: ingredient ? ingredient.name : ingredient,
    amount,
    selector,
    measure: ingredient ? ingredient.dimension : ingredient,
  }));

  const fotmater = (value) => <Format>{value}</Format>;

  const selectorRenderer = (_, rowData, id) => (
    <Select style={{ width: 300 }} min={0} onChange={(ingredientId) => { data.setIngredient(id, ingredientId); }} value={rowData.ingredientId}>
      { rowData.selector.map(([value, label]) => <Option key={value} value={value}>{label}</Option>)}
    </Select>
  );

  const inputRenderer = (value, _, id) => (
    <InputNumber min={0} onChange={(amount) => { data.setAmount(id, amount); }} value={value} />
  );

  const remover = (_, __, id) => {
    if (isEdditing && !data.isEmpty) {
      return <Button type="text" icon={<Icon name="trash-2-outline" />} onClick={() => { data.remove(id); }} />;
    }
    return null;
  };

  const columns = [
    {
      dataIndex: 'id',
      title: '№',
    },
    {
      dataIndex: 'name',
      title: 'Ингридиент',
      render: isEdditing ? selectorRenderer : fotmater,
    },
    {
      dataIndex: 'amount',
      title: 'Кол-во',
      render: isEdditing ? inputRenderer : fotmater,
    },
    {
      dataIndex: 'measure',
      title: 'Ед. изм.',
      render: fotmater,
    },
    {
      dataIndex: 'remove',
      title: '',
      render: remover,
    },
  ];

  if (!isEdditing && data.isEmpty) {
    return (
      <div className={style.norecipe}>
        <NoData>
          <div className={style.strong}>Рецептура не заполнена</div>
          <div>Начните редактирование</div>
        </NoData>
      </div>
    );
  }

  return (
    <>
      { ds.length > 0 && (
        <Table
          className={style.viewer}
          columns={columns}
          dataSource={ds}
          pagination={false}
        />
      )}
      { isEdditing && <Button icon={<PlusOutlined />} onClick={() => { data.add(); }}>Добавить ингридиент</Button> }
    </>
  );
};

export default observer(RecipeEditroTable);
