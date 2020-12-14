import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

import SpeedometerWidget from 'components/dashboard/spidometr';
import SpeedometerModel from 'models/dashboard/widgets/speedometer';
import OverviewWidget from 'components/dashboard/statistic';
import OverviewModel from 'models/dashboard/widgets/statistic';
import ChartBeveragesSalesWidget from 'components/dashboard/chartBeveragesSales';
import ChartBeveragesSalesModel from 'models/dashboard/widgets/chartBeveragesSales';
import HeatmapDeviceStatusesWidget from 'components/dashboard/heatmapDeviceStatuses';
import HeatmapDeviceStatusesModel from 'models/dashboard/widgets/heatmapDeviceStatuses';
import DiagramTechStateWidget from 'components/dashboard/diagramTechState';
import DiagramTechStateModel from 'models/dashboard/widgets/diagramTechState';
import DiagramPopularityWidget from 'components/dashboard/diagramPopularity';
import DiagramPopularityModel from 'models/dashboard/widgets/diagramPopularity';
import DiagramSalePointsBeveragesRateWidget from 'components/dashboard/diagramSalePointsBeveragesRate';
import DiagramSalePointsBeveragesRateModel from 'models/dashboard/widgets/diagramSalePointsBeveragesRate';
import ChartSalesWidget from 'components/dashboard/chartSales';
import ChartSalesModel from 'models/dashboard/widgets/chartSales';
import ChartBeveragesWidget from 'components/dashboard/chartBeverages';
import ChartBeveragesModel from 'models/dashboard/widgets/chartBeverages';
import ChartBeveragesChangeWidget from 'components/dashboard/chartBeveragesChange';
import ChartBeveragesChangeModel from 'models/dashboard/widgets/chartBeveragesChange';
import FavoriteObjectsWidget from 'components/dashboard/favoriteObjects';
import FavoriteObjectsModel from 'models/dashboard/widgets/favoriteObjects';
import LatestBeveragesWidget from 'components/dashboard/latestBeverages';
import LatestBeveragesModel from 'models/dashboard/widgets/latestBeverages';
import LatestEventsWidget from 'components/dashboard/latestEvents';
import LatestEventsModel from 'models/dashboard/widgets/latestEvents';
import DeviceListDowntimeWidget from 'components/dashboard/deviceListDowntime';
import DeviceListDowntimeModel from 'models/dashboard/widgets/deviceListDowntime';
import DeviceListOffWidget from 'components/dashboard/deviceListOff';
import DeviceListOffModel from 'models/dashboard/widgets/deviceListOff';

/**
 *
    rowSpan: сколько строк выделать для виджета, каждая строка 5 пикселей. Высотой считается вся высота виджета вместе с заголовком и дэйтапикером
    colSpan: число колонок выделяемых для виджета,
    defaultDateRange: Умолчательный дэйтарендж,
    excludedDateRandes: сет из ключей дейтаренжей
    tickDiration: частота обновления в секундах.
 */
const WIDGETS_ADDITIONAL_INFORMATION = {
  speedometerBeverages: {
    rowSpan: 76,
    colSpan: 1,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 60,
    widget: SpeedometerWidget,
    model: SpeedometerModel,
  },
  overview: {
    rowSpan: 76,
    colSpan: 3,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 60,
    widget: OverviewWidget,
    model: OverviewModel,
  },
  chartBeveragesSales: {
    rowSpan: 96,
    colSpan: 3,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    tickDuration: 60,
    widget: ChartBeveragesSalesWidget,
    model: ChartBeveragesSalesModel,
  },
  heatmapDeviceStatuses: {
    rowSpan: 76,
    colSpan: 2,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 350,
    widget: HeatmapDeviceStatusesWidget,
    model: HeatmapDeviceStatusesModel,
  },
  diagramTechState: {
    rowSpan: 71,
    colSpan: 2,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 60,
    widget: DiagramTechStateWidget,
    model: DiagramTechStateModel,
  },
  diagramPopularity: {
    rowSpan: 118,
    colSpan: 1,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: DiagramPopularityWidget,
    model: DiagramPopularityModel,
  },
  diagramSalePointsBeveragesRate: {
    rowSpan: 124,
    colSpan: 2,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: false,
    tickDuration: 600,
    widget: DiagramSalePointsBeveragesRateWidget,
    model: DiagramSalePointsBeveragesRateModel,
  },
  chartSales: {
    rowSpan: 76,
    colSpan: 1,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    tickDuration: 350,
    widget: ChartSalesWidget,
    model: ChartSalesModel,
  },
  chartBeverages: {
    rowSpan: 76,
    colSpan: 1,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    tickDuration: 350,
    widget: ChartBeveragesWidget,
    model: ChartBeveragesModel,
  },
  chartBeveragesChange: {
    rowSpan: 99,
    colSpan: 2,
    defaultDateRange: 'prw7Days',
    excludedDateRandes: new Set([null]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: ChartBeveragesChangeWidget,
    model: ChartBeveragesChangeModel,
  },
  favoriteObjects: {
    rowSpan: 99,
    colSpan: 2,
    defaultDateRange: 'prw7Days',
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: false,
    tickDuration: 3600,
    widget: FavoriteObjectsWidget,
    model: FavoriteObjectsModel,
  },
  latestBeverages: {
    rowSpan: 116,
    colSpan: 3,
    defaultDateRange: null,
    excludedDateRandes: new Set(),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: LatestBeveragesWidget,
    model: LatestBeveragesModel,
  },
  latestEvents: {
    rowSpan: 121,
    colSpan: 2,
    defaultDateRange: null,
    excludedDateRandes: new Set(),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: LatestEventsWidget,
    model: LatestEventsModel,
  },
  deviceListDowntime: {
    rowSpan: 93,
    colSpan: 2,
    defaultDateRange: 'prw7Days',
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: DeviceListDowntimeWidget,
    model: DeviceListDowntimeModel,
  },
  deviceListOff: {
    rowSpan: 107,
    colSpan: 2,
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: DeviceListOffWidget,
    model: DeviceListOffModel,
  },
};

const getDashboardWidgetsInfo = () => get('/refs/widget_references/').then((result) => {
  if (!Array.isArray(result)) {
    apiCheckConsole.error('unexpected respounce from /refs/widget_references/', result);
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
    if (!(json.uid in WIDGETS_ADDITIONAL_INFORMATION)) {
      apiCheckConsole.warn('не реализован виджет', `${json.uid}: ${json.name}`);
    }
    types[json.uid] = {
      title: json.name,
      description: json.description,
    };
  }
  for (const key of Object.keys(WIDGETS_ADDITIONAL_INFORMATION)) {
    if (!(key in types)) {
      apiCheckConsole.error(`виджет типа ${key} не описан в справочнике виджетов /refs/widget_references/`);
    }
  }
  return types;
});

export { getDashboardWidgetsInfo as default, WIDGETS_ADDITIONAL_INFORMATION };
