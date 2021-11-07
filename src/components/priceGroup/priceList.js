import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Popconfirm, InputNumber, Space, message,
} from 'antd';

import Icon from 'elements/icon';
import Format from 'elements/format';
import Typography from 'elements/typography';

import List from './list';
import priceCell from './priceCell';

const COLUMNS = [
  {
    title: 'PLU (доп PLU)',
    dataIndex: 'plu',
    width: 160,
  },
  {
    title: 'Название',
    dataIndex: 'name',
    render: (name) => <Format>{name}</Format>,
    sorter: (a, b) => {
      if (typeof a.name === 'string' && typeof b.name === 'string') {
        return a.name.localeCompare(b.name) || a.key - b.key;
      }
      return a.key - b.key;
    },
    defaultSortOrder: 'ascend',
  },
  {
    title: 'НДС',
    dataIndex: 'nds',
    render: (v) => <Format>{v}</Format>,
  },
  {
    title: 'Цена (позиция)',
    dataIndex: 'value',
    width: 260,
    render: priceCell,
    sorter: (a, b) => b.value - a.value || a.key - b.key,
  },
  {
    title: '',
    dataIndex: 'rm',
    render: (rm) => (
      <Popconfirm
        placement="left"
        title="Отмена операции невозможна. Продолжить удаление?"
        onConfirm={rm}
        okText="Да"
        cancelText="Нет"
      >
        <Button icon={<Icon size={20} name="trash-2-outline" />} type="text" />
      </Popconfirm>
    ),
  },
];

const DecimalPlaces = ({ group }) => {
  const [localValue, setLocalValue] = useState(group.decimalPlaces);
  const save = () => {
    group.setDecimalPlaces(localValue).then(() => message.success(`Кол-во знаков после запятой для группы "${group.name}" успешно обновлено!`));
  };
  const cancel = () => {
    setLocalValue(group.decimalPlaces);
  };
  const disabled = localValue === group.decimalPlaces;

  return (
    <Space>
      <Typography.Caption>Кол-во знаков после запятой</Typography.Caption>
      {' '}
      <InputNumber onChange={setLocalValue} onPressEnter={save} value={localValue} />
      <Button onClick={save} disabled={disabled}><Icon name="checkmark-outline" /></Button>
      <Button onClick={cancel} disabled={disabled}><Icon name="close-outline" /></Button>
    </Space>
  );
};

const PriceList = ({ element, onAdd, isLoading }) => {
  const { conceptionExtPLU } = element;
  const toDataSource = (price) => ({
    plu: `${price.plu} (${(conceptionExtPLU && conceptionExtPLU[price.drinkId]) || '—'})`,
    key: price.id,
    name: price.name,
    value: price.value,
    nds: price.nds,
    codeExt: price.codeExt,
    currency: price.currency,
    rm: () => element.removePrice(price.id),
    sendValue: (value, codeExt) => price.setValue(value, codeExt),
  });

  return (
    <List
      isLoading={isLoading}
      dataSource={element.prices}
      toDataSource={toDataSource}
      columns={COLUMNS}
      onAdd={onAdd}
      title={`Список напитков (${element.drinksCount})`}
      actions={<DecimalPlaces group={element} />}
    />
  );
};

export default inject('element')(observer(PriceList));
