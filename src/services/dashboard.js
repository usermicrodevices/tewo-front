import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const DASHBOARD_WIDGETS_TYPE = (() => {
  const t = {};
  for (const i of [
    'speedometerBeverages',
    'overview',
    'chartBeveragesSales',
    'heatmapDeviceStatuses',
    'diagramTechState',
    'diagramPopularity',
    'diagramSalePointsBeveragesRate',
    'chartSales',
    'chartBeverages',
  ]) {
    t[i] = i;
  }
  return t;
})();

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
    if (!(json.uid in DASHBOARD_WIDGETS_TYPE)) {
      console.warn('не реализован виджет', `${json.uid}: ${json.name}`);
    }
    types[json.uid] = {
      title: json.name,
      description: json.description,
    };
  }
  for (const key of Object.keys(DASHBOARD_WIDGETS_TYPE)) {
    if (!(key in types)) {
      console.error(`виджет типа ${key} не описан в справочнике виджетов /refs/widget_references/`);
    }
  }
  return types;
});

export { getDashboardWidgetsInfo as default, DASHBOARD_WIDGETS_TYPE };
