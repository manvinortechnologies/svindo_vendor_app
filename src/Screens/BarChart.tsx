import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";

interface SalesExpenseData {
  month: string;
  month_label: string;
  sales: number;
  expenses: number;
}

interface GroupedBarsProps {
  data?: SalesExpenseData[];
}

export default function GroupedBars({ data }: GroupedBarsProps) {
  // Transform API data to chart format
  const barData = useMemo(() => {
    if (!data || data.length === 0) {
      // Return empty/default data if no data provided
      return [];
    }

    // Flatten the data: for each month, create two bars (sales and expenses)
    const flattened: any[] = [];
    data.slice(7, data.length).forEach((item) => {
      // Extract month abbreviation from month_label (e.g., "Dec 2025" -> "Dec")
      // month_label format: "Dec 2025" or similar
      const monthLabel = item.month_label.split(" ")[0].substring(0, 3);

      // Sales bar (blue) - gets the label
      flattened.push({
        value: Number(item.sales) || 0,
        label: monthLabel,
        spacing: 2,
        labelWidth: 30,
        labelTextStyle: { color: "gray" },
        frontColor: "#177AD5",
      });
      // Expenses bar (red) - no label
      flattened.push({
        value: Number(item.expenses) || 0,
        frontColor: "#ED6665",
      });
    });

    return flattened;
  }, [data]);

  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 100;
    return Math.max(
      ...data.map((item) => Math.max(item.sales || 0, item.expenses || 0)),
      100
    );
  }, [data]);

  const renderTitle = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ color: "gray", marginRight: 2 }}>Total Sales</Text>
          <View
            style={{
              height: 10,
              width: 16,
              borderRadius: 6,
              backgroundColor: "#177AD5",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ color: "gray", marginRight: 2 }}>Total Expense</Text>
          <View
            style={{
              height: 10,
              width: 16,
              borderRadius: 6,
              backgroundColor: "#ED6665",
            }}
          />
        </View>
      </View>
    );
  };

  // Don't render chart if no data
  if (!data || data.length === 0 || barData.length === 0) {
    return (
      <View
        style={{
          height: s(130),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "gray" }}>No data available</Text>
        {renderTitle()}
      </View>
    );
  }

  return (
    <>
      <BarChart
        data={barData}
        barWidth={s(8)}
        // spacing={s(20)}
        roundedTop
        // roundedBottom
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: "gray" }}
        noOfSections={5}
        maxValue={maxValue}
        height={s(130)}
        // backgroundColor="red"
        // width={s(280)}
        // adjustToWidth
      />
      {renderTitle()}
    </>
  );
}
