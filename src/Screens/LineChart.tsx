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
  // Calculate max value for Y-axis
  const maxValue = Math.max(...data.map((item) => item.value || 0), 0);
  const minValue = Math.min(...data.map((item) => item.value || 0), 0);

  // Round max value up to nearest whole number for Y-axis
  const roundedMaxValue = Math.ceil(maxValue + 10);
  const roundedMinValue = Math.floor(minValue);

  // Calculate step value to ensure whole numbers
  const valueRange =
    roundedMaxValue - (roundedMinValue >= 0 ? 0 : roundedMinValue);
  const stepValue =
    valueRange > 0 ? Math.ceil(valueRange / (data?.length || 8)) : 1;

  // Add text property to each data point to show the value
  const dataWithText = data.map((item) => ({
    ...item,
    dataPointText: item.value?.toString() || "0",
    textFontSize: s(10),
    textColor: color,
    textShiftY: -5,
    // textShiftX: 5,
  }));

  return (
    <LineChart
      data={dataWithText}
      color1={color}
      dataPointsColor1={color}
      width={width - s(65)}
      adjustToWidth
      spacing={s(23)}
      // endSpacing={s(20)}
      formatYLabel={(value) => {
        const numValue = parseFloat(value);
        return Math.round(numValue).toString();
      }}
      maxValue={roundedMaxValue}
      // mostNegativeValue={roundedMinValue < 0 ? roundedMinValue : undefined}
      stepValue={stepValue}
      yAxisTextStyle={{ color: "gray" }}
      xAxisLabelTextStyle={{ color: "gray", fontSize: 12 }}
      xAxisColor="gray"
      xAxisThickness={1}
      noOfSections={data?.length || 8}
      isAnimated
    />
  );
}
