import { InspectorAgentDataSourceChart } from '@pinpoint-fe/constants';

type TooltipContentsData = {
  id: string;
  values: Record<string, unknown>[];
  color: string;
};

export const useDataSourceChartTooltip = (
  tooltipData: InspectorAgentDataSourceChart.MetricValueGroup[] = [],
) => {
  const tooltipTitleList = [
    'Jdbc URL',
    'ServiceType Code',
    'Active Avg',
    'Active Max',
    'Total Max',
  ];

  const getTooltipData = (focusIndex: number) =>
    tooltipData.map(({ metricValues, tags }) => {
      return {
        jdbcUrl: tags[2].value,
        serviceTypeCode: tags[0].value,
        activeAvg: metricValues[0].valueList[focusIndex],
        activeMax: metricValues[1].valueList[focusIndex],
        totalMax: metricValues[2].valueList[focusIndex],
      };
    });

  const getTooltipStr = (titleList: string[], contentsData: TooltipContentsData[]) => {
    const header = titleList
      .map((title) => {
        return `<th>${title}</th>`;
      })
      .join('');
    const body = contentsData
      .map((d, i) => {
        const { id, values, color } = d;
        return `
          <tr class="bb-tooltip-name-${id}">
            <td class="name"><span style="background-color:${color}"></span>${id}</td>
            ${Object.values(values[i])
              ?.map(
                (value) =>
                  `<td class="value"><div style="word-break:break-all;white-space:normal;">${value}</div></td>`,
              )
              .join('')}
          </tr>
        `;
      })
      .join('');
    return `<table class="bb-tooltip" style="width:100%;box-shadow:none;">
    <tbody><tr>${header}</tr>${body}</tbody></table>`;
  };

  return { getTooltipData, getTooltipStr, tooltipTitleList };
};
