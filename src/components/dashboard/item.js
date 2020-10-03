import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Card } from 'antd';
import {
  MoreOutlined, SettingOutlined, CloseOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';

import classes from './item.module.scss';

const Item = ({
  children, item, className, style, onMouseDown, onMouseUp, onTouchEnd, itemKey, grid,
}) => (
  <Card
    className={classnames(classes.item, className)}
    style={style}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onTouchEnd={onTouchEnd}
  >
    <div className={classes.header}>
      <div className={classes.label}>
        <Button type="text" className={classes.anchor} icon={<MoreOutlined />} />
        <div className={classes.text}>
          { item.title }
        </div>
      </div>
      <div className={classes.toolbar}>
        <Button type="text" onClick={() => grid.editSettings(item)} icon={<SettingOutlined />} />
        <Button type="text" onClick={() => grid.remove(item)} icon={<CloseOutlined />} />
      </div>
    </div>
    {children}
  </Card>
);

export default inject('grid')(observer(Item));
