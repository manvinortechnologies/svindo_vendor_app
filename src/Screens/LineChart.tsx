import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
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
    />
  );
}
