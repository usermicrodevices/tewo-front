import { WIDGETS_ADDITIONAL_INFORMATION as WIDGETS } from 'services/dashboard';

const k = (itm) => Object.keys(WIDGETS).find((t) => WIDGETS[t] === itm);

const getDefaultState = (session) => ({
  begin_0: {
    widgetType: k(WIDGETS.overview),
    dateFilter: null,
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_1: {
    widgetType: k(WIDGETS.speedometerBeverages),
    dateFilter: null,
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_2: {
    widgetType: k(WIDGETS.chartBeverages),
    dateFilter: 'prw7Days',
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_3: {
    widgetType: k(WIDGETS.heatmapDeviceStatuses),
    dateFilter: 'curDay',
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_4: {
    widgetType: k(WIDGETS.chartSales),
    dateFilter: 'prw7Days',
    salePontsFilter: null,
    companiesFilter: null,
  },
});

export default getDefaultState;
