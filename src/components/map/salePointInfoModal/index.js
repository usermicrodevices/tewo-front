import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Divider, Table } from 'antd';

import Location from 'elements/location';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Оборудование',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Статус',
    dataIndex: 'isOn',
    key: 'isOn',
    render: (value, record, index) => (value ? 'Вкл' : 'Выкл'),
  },
];

function SalePointInfoModal({
  salePoint, visible, onCancel, history,
}) {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={() => history.push(salePoint.path)}
      okText="Перейти на объект"
      cancelText="Закрыть"
    >
      {salePoint ? (
        <div>
          <div>
            <h3>{salePoint.name}</h3>
            <Location
              location={salePoint.location}
              address={salePoint.address}
            />
          </div>
          <Divider />

          <Table pagination={false} dataSource={salePoint.devices} columns={columns} />
        </div>
      ) : null}
    </Modal>
  );
}

export default withRouter(observer(SalePointInfoModal));
