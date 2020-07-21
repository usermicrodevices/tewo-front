import React from 'react';
import {
  PieChartOutlined,
  FlagOutlined,
  ReadOutlined,
  BarChartOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import {
  dashboard,
  map,
  companies,
} from 'routes';

class MenuItem {
  icon;

  text;

  act;

  constructor(icon, text, act) {
    this.icon = icon;
    this.text = text;
    this.act = act;
  }
}

const items = [
  new MenuItem(
    <PieChartOutlined />,
    'Панель управления',
    dashboard,
  ),
  new MenuItem(
    <FlagOutlined />,
    'Карта объектов',
    map,
  ),
  new MenuItem(
    <BarChartOutlined />,
    'Коммерческий раздел',
    [
      {
        text: 'Себестоимость / выручка',
      },
      {
        text: 'Расходы ингридиентов',
      },
      {
        text: 'Динамика продаж',
      },
      {
        text: 'Структура продаж',
      },
      {
        text: 'Отмена напитков',
      },
      {
        text: 'Расходы чистящих средств',
      },
    ],
  ),
  new MenuItem(
    <ExperimentOutlined />,
    'Технический раздел',
  ),
  new MenuItem(
    <ReadOutlined />,
    'Справочник',
    [
      {
        text: 'Компании',
        act: companies,
      },
      {
        text: 'Объекты',
      },
    ],
  ),
];

export default items;
