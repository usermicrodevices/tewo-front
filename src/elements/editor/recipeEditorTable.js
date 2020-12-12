import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Table, Button, InputNumber, Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Icon from 'elements/icon';

import Format from 'elements/format';
import NoData from 'elements/noData';

import style from './style.module.scss';

const { Option } = Select;

const RecipeEditroTable = ({ data, isEdditing }) => {
  if (!isEdditing && data.isEmpty) {
    return (
      <div className={style.norecipe}>
        <NoData
          noMargin
          title="Рецептура не заполнена"
          text="Начните редактирование"
        />
      </div>
    );
  }

  const ds = data.ingredients.map(({
    id: ingredientId, amount, ingredient, selector,
  }, index) => ({
    key: index,
    id: index + 1,
    ingredientId,
    name: ingredient ? ingredient.name : ingredient,
    amount,
    selector,
    measure: ingredient ? ingredient.dimension : ingredient,
  }));

  const { ingredientsSelector } = data;

  const fotmater = (value) => <Format>{value}</Format>;

  const selectorRenderer = (_, rowData, id) => (
    <Select
      style={{ width: 300 }}
      min={0}
      onChange={(ingredientId) => { data.setIngredient(id, ingredientId); }}
      value={rowData.name}
      disabled={ingredientsSelector.length === 0}
    >
      { ingredientsSelector.map(([value, label]) => <Option key={value} value={value}>{label}</Option>)}
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
      title: 'Ингредиент',
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

  return (
    <>
      <div>
        Для добавления нового ингредиента перейдите в раздел
        {' '}
        <Link to="/ingredients">Ингредиенты</Link>
      </div>
      { ds.length > 0 && (
        <Table
          className={style.viewer}
          columns={columns}
          dataSource={ds}
          pagination={false}
        />
      )}
      { isEdditing && (
        <Button disabled={ingredientsSelector.length === 0} icon={<PlusOutlined />} onClick={() => { data.add(); }}>
          {ingredientsSelector.length > 0 ? 'Добавить ингредиент' : 'В рецепте использованы все ингредиенты'}
        </Button>
      )}
    </>
  );
};

export default observer(RecipeEditroTable);
