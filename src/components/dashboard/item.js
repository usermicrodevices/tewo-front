import React from 'react';
import { Button, Card } from 'antd';
import {
  MoreOutlined, SettingOutlined, CloseOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';

import classes from './style.module.scss';

const Item = ({
  children, title, className, style, onMouseDown, onMouseUp, onTouchEnd,
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
          { title }
        </div>
      </div>
      <div className={classes.toolbar}>
        <Button type="text" icon={<SettingOutlined />} />
        <Button type="text" icon={<CloseOutlined />} />
      </div>
    </div>
    {children}
  </Card>
);

export default Item;
