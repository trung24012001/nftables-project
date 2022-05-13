import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";

const options = {
  color: ["#00B6CD"],
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
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
  }
};

export default function EchartBar({ analytics }: {
  analytics: Record<string, number>[]
}) {
  useEffect(() => {
    const keys = [], values = []
    for (let item of analytics) {
      const [key] = Object.keys(item);
      keys.push(key)
      values.push(+item[key])
    }
    options.xAxis.data = keys as never[]
    options.series[0].data = values as never[]

    console.log('xxxx', options)

  }, [analytics])
  console.log(options)
  return (
    <>
      {options.xAxis.data.length > 0 &&
        < ReactEcharts option={options} />
      }
    </>
  );
}