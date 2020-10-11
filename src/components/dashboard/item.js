import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Card, Tooltip } from 'antd';
import {
  MoreOutlined, SettingOutlined, CloseOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import plural from 'utils/plural';

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
  return `${name} и ещё ${more} ${plural(more, ['объект', 'объектов', 'объекта'])}`;
};

const Item = ({
  children, item, className, style, onMouseDown, onMouseUp, onTouchEnd, grid,
}) => (
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
            <div className={classes.maintitle}>{item.title}</div>
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
    </Card>
  </div>
);

export default inject('grid')(observer(Item));
