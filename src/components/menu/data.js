import React from 'react';
import Icon from 'elements/icon';
import {
  dashboard,
  map,
  companies,
  salePoints,
  beverage,
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
    <Icon name="pie-chart-outline" size="16" />,
    'Панель управления',
    dashboard,
  ),
  new MenuItem(
    <Icon name="flag-outline" size="16" />,
    'Карта объектов',
    map,
  ),
  new MenuItem(
    <Icon name="clipboard-outline" size="16" />,
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
    <Icon name="code-download-outline" size="16" />,
    'Технический раздел',
    [
      {
        text: 'Просроченные задачи',
      },
      {
        text: 'Журнал событий',
      },
      {
        text: 'Журнал наливов',
        act: beverage,
      },
      {
        text: 'Журнал очисток',
      },
      {
        text: 'Статистика напряжения',
      },
    ],
  ),
  new MenuItem(
    <Icon name="book-open-outline" size="16" />,
    'Справочник',
    [
      {
        text: 'Компании',
        act: companies,
      },
      {
        text: 'Объекты',
        act: salePoints,
      },
    ],
  ),
];

export default items;
