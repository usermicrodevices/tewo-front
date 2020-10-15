import { DASHBOARD_WIDGETS_TYPE as WIDGET_TYPES } from 'services/dashboard';

const getDefaultState = (session) => ({
  begin_0: {
    widgetType: WIDGET_TYPES.overview,
    dateFilter: null,
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_1: {
    widgetType: WIDGET_TYPES.speedometerBeverages,
    dateFilter: null,
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_2: {
    widgetType: WIDGET_TYPES.chartBeverages,
    dateFilter: 'prw7Days',
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_3: {
    widgetType: WIDGET_TYPES.heatmapDeviceStatuses,
    dateFilter: 'curDay',
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_4: {
    widgetType: WIDGET_TYPES.chartSales,
    dateFilter: 'prw7Days',
    salePontsFilter: null,
    companiesFilter: null,
  },
});

export default getDefaultState;
