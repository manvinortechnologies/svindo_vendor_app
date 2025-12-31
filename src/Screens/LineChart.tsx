import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
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
      width={width - 70}
      adjustToWidth
      yAxisTextStyle={{ color: "gray" }}
      xAxisLabelTextStyle={{ color: "gray", fontSize: 12 }}
      xAxisColor="gray"
      xAxisThickness={1}
      noOfSections={8}
      // stepValue={2}
    />
  );
}
