const getDefaultState = (session) => ({
  begin_0: {
    widgetType: 'overview',
    dateFilter: null,
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_1: {
    widgetType: 'speedometerBeverages',
    dateFilter: null,
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_2: {
    widgetType: 'chartBeverages',
    dateFilter: 'prw7Days',
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_3: {
    widgetType: 'heatmapDeviceStatuses',
    dateFilter: 'curDay',
    salePontsFilter: null,
    companiesFilter: null,
  },
  begin_4: {
    widgetType: 'chartSales',
    dateFilter: 'prw7Days',
    salePontsFilter: null,
    companiesFilter: null,
  },
});

export default getDefaultState;
