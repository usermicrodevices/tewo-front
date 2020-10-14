import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const TYPES = new Set(Object.keys({
  favoriteObjects: 'Избранные объекты',
  speedometerBeverages: 'Спидометр наливов',
  mapSalePoints: 'Карта объектов',
  overview: 'Живая статистика',
  deviceListPendingMaintenance: 'Список оборудования на ТО',
  deviceListOverdudeTasks: 'Просроченные события по оборудованию',
  deviceListDowntime: 'Объекты с простоем',
  deviceListDisabled: 'Неиспользуемое оборудование',
  deviceListAwaitingCleaning: 'Не вымытое оборудование',
  latestEvents: 'Последние события',
  latestBeverages: 'Последние наливы',
  heatmapDeviceStatuses: 'Тепловая карта статусов устройств',
  heatmapOverdudeTasks: 'Тепловая карта просроченных событий',
  heatmapClearances: 'Тепловая карта очисток',
  diagramSalePointsBeveragesRate: 'Рейтинг объектов по наливам',
  diagramIngredientsUsage: 'Диаграмма расхода ингредиентов',
  diagramPopularity: 'Диаграмма популярности напитков',
  diagramTechState: 'Статистика состояния оборудования',
  chartBeveragesSales: 'Динамика наливов и продаж',
  chartBeverages: 'Динамика наливов',
  chartSales: 'Динамика продаж',
  chartBeveragesChange: 'Отмена напитков',
  chartCost: 'Себестоимость',
}));

const getDashboardWidgetsInfo = () => get('/refs/widget_references/').then((result) => {
  if (!Array.isArray(result)) {
    console.error('unexpected respounce from /refs/widget_references/', result);
  }
  const mustBe = {
    id: 'number',
    uid: 'string',
    name: 'string',
    description: 'string',
  };
  const types = {};
  for (const json of result) {
    checkData(json, mustBe);
    if (!TYPES.has(json.uid)) {
      console.error('unflown widget type', json);
    }
    types[json.uid] = {
      title: json.name,
      description: json.description,
    };
  }
  for (const key of TYPES.keys()) {
    if (!(key in types)) {
      console.error(`виджет типа ${key} не описан в справочнике виджетов /refs/widget_references/`);
    }
  }
  return types;
});

export default getDashboardWidgetsInfo;
