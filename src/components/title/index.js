import React from 'react';
import { inject, observer } from 'mobx-react';
import { useLocation, Link } from 'react-router-dom';
import { PageHeader, Menu } from 'antd';

import style from './style.module.scss';

const Title = ({
  children,
  tabs,
  buttons,
  breadcrumb,
  table,
}) => {
  const { pathname: currentPath } = useLocation();
  const findCurrentTab = () => {
    if (!Array.isArray(tabs)) {
      return [];
    }
    for (const tab of tabs) {
      if (currentPath === tab.path) {
        return [tab.text];
      }
    }
    return [];
  };
  const currentTab = findCurrentTab();

  return (
    <PageHeader
      title={children}
      breadcrumb={breadcrumb}
      nzGhost={false}
      className={style.title}
      extra={buttons || []}
    >
      <Menu selectedKeys={currentTab} mode="horizontal">
        { tabs
          && tabs.map(({ icon, text, path }) => (
            <Menu.Item key={text} icon={icon}>
              <Link to={path}>{text}</Link>
            </Menu.Item>
          )) }
      </Menu>
    </PageHeader>
  );
};

export default inject('table')(observer(Title));
