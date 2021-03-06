import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

import SpeedometerWidget from 'components/dashboard/spidometr';
import SpeedometerModel from 'models/dashboard/widgets/speedometer';
import OverviewWidget from 'components/dashboard/statistic';
import OverviewModel from 'models/dashboard/widgets/statistic';
import ChartBeveragesSalesWidget from 'components/dashboard/chartBeveragesSales';
import ChartBeveragesSalesModel from 'models/dashboard/widgets/chartBeveragesSales';
import HeatmapDevices from 'components/dashboard/heatmapDevices';
import HeatmapDeviceStatusesModel from 'models/dashboard/widgets/heatmapDeviceStatuses';
import HeatmapClearancesModel from 'models/dashboard/widgets/heatmapClearances';
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
import MapWidget from 'components/dashboard/map';
import MapWidgetModel from 'models/dashboard/widgets/map';
import ChartCostWidget from 'components/dashboard/chartCost';
import ChartCostModel from 'models/dashboard/widgets/chartCost';
import DiagramIngredientsUsageWidget from 'components/dashboard/diagramIngredientsUsage';
import DiagramIngredientsUsageModel from 'models/dashboard/widgets/diagramIngredientsUsage';
import DeviceListAwaitingCleaningWidget from 'components/dashboard/deviceListAwaitingCleaning';
import DeviceListAwaitingCleaningModel from 'models/dashboard/widgets/deviceListAwaitingCleaning';
import DeviceListDisabledWidget from 'components/dashboard/deviceListDisabled';
import DeviceListDisabledModel from 'models/dashboard/widgets/deviceListDisabled';

/**
 *
    rowSpan: ?????????????? ?????????? ???????????????? ?????? ??????????????, ???????????? ???????????? 5 ????????????????. ?????????????? ?????????????????? ?????? ???????????? ?????????????? ???????????? ?? ???????????????????? ?? ????????????????????????
    colSpan: ?????????? ?????????????? ???????????????????? ?????? ??????????????,
    defaultDateRange: ?????????????????????????? ????????????????????,
    excludedDateRandes: ?????? ???? ???????????? ??????????????????????
    tickDiration: ?????????????? ???????????????????? ?? ????????????????.
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
    widget: HeatmapDevices,
    model: HeatmapDeviceStatusesModel,
  },
  heatmapClearances: {
    rowSpan: 76,
    colSpan: 2,
    defaultDateRange: 'prw7Days',
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    tickDuration: 350,
    widget: HeatmapDevices,
    model: HeatmapClearancesModel,
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
    defaultDateRange: 'prw7Days',
    excludedDateRandes: new Set([]),
    isHaveDateFilter: true,
    isHavePointsFilter: true,
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
    tickDuration: 60,
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
    tickDuration: 60,
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
    tickDuration: 20,
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
  mapSalePoints: {
    rowSpan: 152,
    colSpan: 2,
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    excludedDateRandes: new Set([]),
    widget: MapWidget,
    model: MapWidgetModel,
  },
  chartCost: {
    rowSpan: 116,
    colSpan: 2,
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    excludedDateRandes: new Set([]),
    widget: ChartCostWidget,
    model: ChartCostModel,
  },
  diagramIngredientsUsage: {
    rowSpan: 76,
    colSpan: 2,
    isHaveDateFilter: true,
    isHavePointsFilter: true,
    excludedDateRandes: new Set([]),
    widget: DiagramIngredientsUsageWidget,
    model: DiagramIngredientsUsageModel,
  },
  deviceListAwaitingCleaning: {
    rowSpan: 93,
    colSpan: 2,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: DeviceListAwaitingCleaningWidget,
    model: DeviceListAwaitingCleaningModel,
  },
  deviceListDisabled: {
    rowSpan: 93,
    colSpan: 2,
    excludedDateRandes: new Set([]),
    isHaveDateFilter: false,
    isHavePointsFilter: true,
    tickDuration: 3600,
    widget: DeviceListDisabledWidget,
    model: DeviceListDisabledModel,
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
      apiCheckConsole.warn('???? ???????????????????? ????????????', `${json.uid}: ${json.name}`);
    } else {
      types[json.uid] = {
        title: json.name,
        description: json.description,
      };
    }
  }
  for (const key of Object.keys(WIDGETS_ADDITIONAL_INFORMATION)) {
    if (!(key in types)) {
      apiCheckConsole.error(`???????????? ???????? ${key} ???? ???????????? ?? ?????????????????????? ???????????????? /refs/widget_references/`);
    }
  }
  return types;
});

export { getDashboardWidgetsInfo as default, WIDGETS_ADDITIONAL_INFORMATION };
