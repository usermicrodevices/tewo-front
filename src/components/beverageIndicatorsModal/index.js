import React from 'react';
import { Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';

const columns = [
  {
    title: 'Показатель',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Значение',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Ед. измерения',
    dataIndex: 'unit',
    key: 'unit',
  },
];

const BeverageIndicatorsModal = ({ session }) => {
  if (!session.beverages.beverageIndicators) {
    return null;
  }

  return (
    <Modal
      title={`Показатели ${session.beverages.beverageIndicators.drinkName} (${session.beverages.beverageIndicators.id})`}
      visible={session.beverages.beverageIndicators}
      width="560px"
      bodyStyle={{
        maxHeight: '80vh',
      }}
      okText="Закрыть"
      onOk={session.beverages.unsetIndicatorBeverage}
      onCancel={session.beverages.unsetIndicatorBeverage}
      footer={null}
      destroyOnClose
    >
      {session.beverages.beverageIndicators.indicatorsList === undefined ? 'Loading...' : (
        <Table dataSource={session.beverages.beverageIndicators.indicatorsList} columns={columns} pagination={false} />
      )}
    </Modal>
  );
};

export default inject('session')(observer(BeverageIndicatorsModal));
