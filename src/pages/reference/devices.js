/* eslint class-methods-use-this: "off" */
import React, { useState } from 'react';
import { Space } from 'antd';
import { inject, observer, Provider } from 'mobx-react';
import { Link } from 'react-router-dom';

import Card from 'elements/card';
import Icon from 'elements/icon';
import Table from 'elements/table';
import Title from 'components/title';
import TableModel from 'models/table';

const COLUMNS = {
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    isAsyncorder: true,
    isDefaultSort: true,
    sortDirections: 'descend',
  },

  name: {
    isVisbleByDefault: true,
    title: 'Название',
    grow: 1,
    sortDirections: 'both',
  },
  setup_date: {
    isVisbleByDefault: true,
    title: 'Дата монтажа',
    grow: 1,
    transform: (date) => date,
    filter: {
      type: 'dateRange',
      title: 'Дата монтажа',
    },
    sortDirections: 'both',
  },
  serial: {
    title: 'Серийный номер',
    grow: 1,
    filter: {
      type: 'text',
      title: 'Серийный номер',
    },
  },
  controller: {
    isVisbleByDefault: true,
    title: 'ID контроллера',
    grow: 1,
    filter: {
      type: 'text',
      title: 'ID контроллера',
    },
  },
  gmt: {
    isVisbleByDefault: true,
    title: 'Временная зона',
    grow: 1,
    filter: {
      type: 'selector',
      title: 'Временная зона',
      selector: [1, 2, 3, 4, 5],
      resolver: ({
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e',
      }),
    },
  },
  type: {
    title: 'Тип оборудования',
    grow: 1,
    filter: {
      type: 'selector',
      title: 'Тип оборудования',
      selector: [1, 2, 3, 4, 5],
      resolver: ({
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e',
      }),
    },
  },
  device_model: {
    isVisbleByDefault: true,
    title: 'Модель оборудования',
    grow: 1,
    filter: {
      type: 'selector',
      title: 'Модель оборудования',
      selector: [1, 2, 3, 4, 5],
      resolver: ({
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e',
      }),
    },
  },
  price_group: {
    title: 'Группа цен',
    grow: 1,
    filter: {
      type: 'selector',
      title: 'Группа цен',
      selector: [1, 2, 3, 4, 5],
      resolver: ({
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e',
      }),
    },
  },
  service_required: {
    title: 'Требуется техобслуживание',
    grow: 1,
    filter: {
      type: 'checkbox',
      title: 'Требуется техобслуживание',
    },
  },
  device: {

  },
};

class DevicesModel extends TableModel {
  constructor() {
    super(COLUMNS, () => Promise.resolve({ count: 0, results: [] }));
  }

  toString() {
    return 'Devicess';
  }
}

const companiesSubmenu = [
  {
    path: '/companies',
    text: 'Каталог',
  },
];

const Devices = ({ session }) => {
  const [table] = useState(new DevicesModel());
  return (
    <>
      <Title tabs={companiesSubmenu}>
        <Space>
          Все компании
          <Link to="companies/add" style={{ fontSize: 22 }}><Icon name="plus-circle-outline" /></Link>
        </Space>
      </Title>
      <Card>
        <Provider table={table} filter={table.filter}>
          <Table />
        </Provider>
      </Card>
    </>
  );
};

export default inject('session')(observer(Devices));
