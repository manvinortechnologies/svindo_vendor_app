import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
const { width, height } = Dimensions.get("window");
export default function LineCharts({ color = "#000000" }: { color?: string }) {
  const data = [{ value: 15 }, { value: 30 }, { value: 26 }, { value: 40 }];
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
