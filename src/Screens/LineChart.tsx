import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";
const { width, height } = Dimensions.get("window");
export default function LineCharts({
  color = "#000000",
  data = [],
}: {
  color?: string;
  data?: any[];
}) {
  return (
    <LineChart
      data={data}
      color1={color}
      dataPointsColor1={color}
      width={width - s(65)}
      adjustToWidth
      yAxisTextStyle={{ color: "gray" }}
      xAxisLabelTextStyle={{ color: "gray", fontSize: 12 }}
      xAxisColor="gray"
      xAxisThickness={1}
      noOfSections={data?.length || 8}
      // stepValue={2}
    />
  );
}
