import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PageHeader, Menu } from 'antd';

import style from './style.module.scss';

const Title = ({
  children,
  tabs,
  buttons,
  breadcrumb,
}) => {
  const { pathname: currentPath } = useLocation();
  const findCurrentTab = () => {
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
      extra={buttons}
    >
      <Menu selectedKeys={currentTab} mode="horizontal">
        {
          tabs.map(({ icon, text, path }) => (
            <Menu.Item key={text} icon={icon}>
              <Link to={path}>{text}</Link>
            </Menu.Item>
          ))
        }
      </Menu>
    </PageHeader>
  );
};

export default Title;
