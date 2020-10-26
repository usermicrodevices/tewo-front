import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Card, Tooltip, Dropdown, Space,
} from 'antd';
import {
  MoreOutlined, SettingOutlined, CloseOutlined, QuestionCircleOutlined, DownOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';

import Typography from 'elements/typography';

import plural from 'utils/plural';

import DateSelector from './dateSelector';
import { isHaveDateFilter } from './settingsEditor';

import classes from './item.module.scss';

const SubTitle = ({ salePoints }) => {
  if (!Array.isArray(salePoints) || salePoints.length === 0) {
    return null;
  }
  const { name } = salePoints[0];
  if (salePoints.length === 1) {
    return name;
  }
  const more = salePoints.length - 1;
  const text = `${name} и ещё ${more} ${plural(more, ['объект', 'объектов', 'объекта'])}`

  return <Typography.Caption>{text}</Typography.Caption>;
};

const Item = ({
  children, item, className, style, onMouseDown, onMouseUp, onTouchEnd, grid,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <div style={style} className={classnames(className, classes.wrap)}>
      <Card
        className={classes.item}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <div className={classes.header}>
          <div className={classes.label}>
            <Button type="text" className={classes.anchor} icon={<MoreOutlined />} />
            <div className={classes.text}>
              <Typography.Title level={4}>{item.title}</Typography.Title>
              <div className={classes.subtitle}>
                <SubTitle salePoints={item.storage.generic.salePoints} />
              </div>
            </div>
          </div>
          <div className={classes.toolbar}>
            <Tooltip placement="top" title={item.description}><Button type="text" icon={<QuestionCircleOutlined />} /></Tooltip>
            <Button type="text" onClick={() => grid.editSettings(item.uid)} icon={<SettingOutlined />} />
            <Button type="text" onClick={() => grid.remove(item.uid)} icon={<CloseOutlined />} />
          </div>
        </div>
        {children}
        {isHaveDateFilter(item.storage.generic.widgetType) && (
          <Dropdown
            className={classes.datepicker}
            onVisibleChange={setMenuOpen}
            visible={isMenuOpen}
            overlay={<DateSelector onClick={({ key }) => { setMenuOpen(false); grid.setDateRange(key, item.uid); }} />}
            placement="bottomRight"
          >
            <div>
              <Space>
                {item.storage.generic.dateRangeName}
                <DownOutlined />
              </Space>
            </div>
          </Dropdown>
        )}
      </Card>
    </div>
  );
};

export default inject('grid')(observer(Item));
