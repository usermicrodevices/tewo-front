import React from 'react';
import { inject, observer } from 'mobx-react';
import { Steps } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined } from '@ant-design/icons';

const { Step } = Steps;

const ELEMNT_MINIMUM_WIDTH = 300;

const Item = inject('device')(observer(({ id, width, device }) => (
  <div style={{ width }}>
    <div>
      {`update ${id} of device ${device.name}`}
    </div>
    <Steps>
      <Step status="finish" icon={<UserOutlined />} />
      <Step status="finish" icon={<SolutionOutlined />} />
      <Step status="process" icon={<LoadingOutlined />} />
    </Steps>
  </div>
)));

export { Item, ELEMNT_MINIMUM_WIDTH };
