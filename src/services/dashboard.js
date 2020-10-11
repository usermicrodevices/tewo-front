const TYPES = {
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
  diagramIngredientsUsage: 'Диаграмма расхода ингредиентов',
  diagramPopularity: 'Диаграмма популярности напитков',
  diagramTechState: 'Статистика состояния оборудования',
  chartBeveragesSales: 'Динамика наливов и продаж',
  chartBeverages: 'Простая динамика наливов',
  chartSales: 'Простая динамика продаж',
  chartBeveragesChange: 'Отмена напитков',
  chartCost: 'Себестоимость',
};

const getDashboardWidgetsInfo = () => new Promise((resolve) => {
  setTimeout(() => {
    const result = {};
    for (const [key, title] of Object.entries(TYPES)) {
      result[key] = {
        title,
        description: 'Описание не задано',
      };
    }
    resolve(result);
  }, 300);
});

export default getDashboardWidgetsInfo;
