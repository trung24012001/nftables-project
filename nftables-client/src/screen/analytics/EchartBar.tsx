import React from "react";
import ReactEcharts from "echarts-for-react";

export default function EchartBar({ analytics }: {
  analytics: Record<string, number>
}) {
  const options = {
    color: ["#00B6CD"],
    xAxis: {
      type: 'category',
      data: Object.keys(analytics)
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: Object.values(analytics),
        type: "bar",
        label: {
          show: true,
          position: 'top',
          color: '#00B6CD'
        },
      }
    ],
    grid: {
      bottom: "40"
    },
  };
  return (
    <>
      {
        options.xAxis.data.length > 0 &&
        <ReactEcharts option={options} notMerge={true} />
      }
    </>
  );
}