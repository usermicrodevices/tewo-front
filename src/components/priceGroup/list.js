import React, { useState } from 'react';
import {
  Card, Table, Button, Input,
} from 'antd';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import Typography from 'elements/typography';

import style from './style.module.scss';

const List = ({
  dataSource, toDataSource, columns, title,
}) => {
  const [filterValue, setFilter] = useState('');
  const toSearch = filterValue.toLowerCase();
  const ds = dataSource
    ?.map(toDataSource)
    ?.filter(({ name }) => typeof name !== 'string' || name.toLowerCase().indexOf(toSearch) >= 0);
  return (
    <Card className={style.card}>
      <div className={style.title}>
        <Typography.Title level={3} className={style.titletext}>
          {title}
        </Typography.Title>
        <Button type="text" disabled icon={<Icon size={22} name="plus-circle-outline" />} />
      </div>
      <Input
        allowClear
        className={style.filter}
        prefix={<Icon name="search-outline" />}
        value={filterValue}
        onChange={({ target }) => { setFilter(target.value); }}
      />
      { dataSource
        ? <Table pagination={false} columns={columns} dataSource={ds} />
        : <Loader size="large" /> }
    </Card>
  );
};

export default List;
