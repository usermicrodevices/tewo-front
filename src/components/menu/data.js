import React from 'react';
import Icon from 'elements/icon';
import {
  dashboard,
  map,
  companies,
  salePoints,
  beverage,
  devices,
  drink,
  ingredients,
  costs,
  events,
  cost,
  ingredientsRate,
  sales,
  cancelationsRate,
  cleansRate,
  overdueLog,
  eventsLog,
  cleansLog,
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
        act: cost,
      },
      {
        text: 'Расходы ингридиентов',
        act: ingredientsRate,
      },
      {
        text: 'Аналитика продаж',
        act: sales,
      },
      {
        text: 'Отмена напитков',
        act: cancelationsRate,
      },
      {
        text: 'Расходы чистящих средств',
        act: cleansRate,
      },
    ],
  ),
  new MenuItem(
    <Icon name="code-download-outline" size="16" />,
    'Технический раздел',
    [
      {
        text: 'Просроченные задачи',
        act: overdueLog,
      },
      {
        text: 'Журнал событий',
        act: eventsLog,
      },
      {
        text: 'Журнал наливов',
        act: beverage,
      },
      {
        text: 'Журнал очисток',
        act: cleansLog,
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
      {
        text: 'Оборудование',
        act: devices,
      },
      {
        text: 'Напитки',
        act: drink,
      },
      {
        text: 'Ингридиенты',
        act: ingredients,
      },
      {
        text: 'Группы цен',
        act: costs,
      },
      {
        text: 'События',
        act: events,
      },
    ],
  ),
];

export default items;
