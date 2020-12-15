import React from 'react';
import { Card } from 'antd';

import Icon from 'elements/icon';
import Typography from 'elements/typography';
import classNames from 'classnames';

import classes from './summary.module.scss';

const Summary = ({ children, align = 'full', className }) => {
  let contentElement = null;

  switch (align) {
    case 'middle': {
      contentElement = <section className={classes.content}>{children}</section>;
      break;
    }
    default:
      contentElement = children;
  }

  return (
    <Card className={classNames(classes.stats, className)}>
      <div className={classes.title}>
        <Typography.Title level={4}>
          <Icon size={18} name="bar-chart-outline" />
          Сводная информация
        </Typography.Title>
      </div>
      { contentElement }
    </Card>
  );
};

export default Summary;
