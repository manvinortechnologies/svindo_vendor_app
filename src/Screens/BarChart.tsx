import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function GroupedBars() {
  const barData = [
    {
      value: 40,
      label: "Jan",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    {
      value: 60,
      frontColor: "#ED6665",
    },

    {
      value: 50,
      label: "Feb",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 75,
      label: "Mar",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 25, frontColor: "#ED6665" },
    {
      value: 30,
      label: "Apr",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 60,
      label: "May",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 65,
      label: "Jun",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 30, frontColor: "#ED6665" },
  ];

  const renderTitle = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              height: 10,
              width: 16,
              borderRadius: 6,
              backgroundColor: "#177AD5",
              marginRight: 8,
            }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              height: 10,
              width: 16,
              borderRadius: 6,
              backgroundColor: "#ED6665",
              marginRight: 8,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        paddingBottom: 5,
        borderRadius: 10,
      }}
    >
      <BarChart
        data={barData}
        barWidth={8}
        spacing={24}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: "gray" }}
        noOfSections={5}
        maxValue={75}
        height={140}
        width={380}
      />
      {renderTitle()}
    </View>
  );
}
