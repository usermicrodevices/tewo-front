export function mapDataItem({ name, value }, idx) {
  return {
    x: name,
    y: value,
  };
}

export function getSeries(data, size) {
  const result = [];

  for (let i = 0; i < data.length; i += size) {
    result.push({
      name: i + 1,
      data: data.slice(i, i + size).map(mapDataItem),
    });
  }

  return result.reverse();
}

export const getHeatmapOptions = ({
  onSelect, legend, title, tooltipTemplate,
}, options = {}) => ({
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    events: {
      dataPointSelection: onSelect,
    },
  },
  plotOptions: {
    heatmap: {
      colorScale: {
        ranges: legend,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    padding: {
      right: 20,
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['#ffffff'],
  },
  title: {
    text: title,
  },
  xaxis: {
    labels: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  legend: {
    position: 'bottom',
  },
  ...(tooltipTemplate
    ? { tooltip: { custom: tooltipTemplate, x: { show: false } } }
    : { tooltop: { enabled: false } }
  ),
  ...options,
});
