import React, { ReactNode } from "react";
import { ViewStyle, StyleProp, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface MainContainerProps {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
  flex?: number;
  backgroundColor?: string;
}

const MainContainer = ({
  children,
  styles,
  flex = 1,
  backgroundColor = "#fff",
}: MainContainerProps) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        {
          flex,
          //   paddingTop: insets.top,
          paddingBottom: -insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor,
        },
        styles,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

export default MainContainer;
