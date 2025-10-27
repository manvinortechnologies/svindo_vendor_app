import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/AntDesign";
import Icons1 from "react-native-vector-icons/Ionicons";
import { s, ScaledSheet } from "react-native-size-matters";
import { HomeNavigation } from "../constants/app-routes.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();

  const currentRoute = state.routes[state.index];

  // Helper function to get the current screen name
  const getCurrentScreenName = () => {
    // First check if we're on a tab that has nested navigation
    if (
      currentRoute.name === HomeNavigation.STORE_SCREEN &&
      currentRoute.state
    ) {
      // Get the nested route name
      const nestedRoute =
        currentRoute.state.routes[currentRoute.state.index || 0];
      return nestedRoute.name;
    }
    // Otherwise return the current route name
    return route.name;
  };

  const currentScreenName = getCurrentScreenName();

  // Check if we're on a store-related screen (Store or Marketing Tools)
  // By default, Online Store should be active when on Store tab
  const isStoreScreen =
    currentScreenName === HomeNavigation.STORE_SCREEN ||
    (currentRoute.name === HomeNavigation.STORE_SCREEN &&
      (!currentRoute.state || currentRoute.state.index === 0));
  const isMarketingScreen =
    currentScreenName === HomeNavigation.MARKETING_TOOLS ||
    (currentRoute.name === HomeNavigation.STORE_SCREEN &&
      currentRoute.state?.index === 1);
  const isStoreRelatedScreen =
    isStoreScreen ||
    isMarketingScreen ||
    currentRoute.name === HomeNavigation.STORE_SCREEN;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Store Options Overlay */}
      {isStoreRelatedScreen && (
        <View style={styles.bottomcontainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              navigation.navigate({
                name: HomeNavigation.STORE_SCREEN,
                params: { screen: HomeNavigation.STORE_SCREEN },
              });
            }}
          >
            <Icon
              name={isStoreScreen ? "storefront" : "storefront-outline"}
              size={20}
              color={isStoreScreen ? "#FCA511" : "#555"}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: isStoreScreen ? "#FCA511" : "#000",
                },
              ]}
            >
              Online Store
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              navigation.navigate({
                name: HomeNavigation.STORE_SCREEN,
                params: { screen: HomeNavigation.MARKETING_TOOLS },
              });
            }}
          >
            <Icons1
              name={isMarketingScreen ? "settings" : "settings-outline"}
              size={20}
              color={isMarketingScreen ? "#FCA511" : "#555"}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: isMarketingScreen ? "#FCA511" : "#000",
                },
              ]}
            >
              Tools
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const getIcon = () => {
            switch (route.name) {
              case HomeNavigation.STATISTICS_SCREEN:
                return (
                  <Icons
                    name={isFocused ? "appstore1" : "appstore-o"}
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.ORDERS:
                return (
                  <Icon
                    name={isFocused ? "shopping" : "shopping-outline"}
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.STOCK_SCREEN:
                return (
                  <Icon
                    name={isFocused ? "chart-box" : "chart-box-outline"}
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.STORE_SCREEN:
                return (
                  <Icon
                    name={isFocused ? "storefront" : "storefront-outline"}
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.ERP:
                return (
                  <Icon
                    name={"menu"}
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              default:
                return null;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              // accessibilityLabel={options.tabBarAccessibilityLabel}
              // testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabBarItem}
            >
              {getIcon()}
              <Text
                style={[styles.tabBarLabel, isFocused && styles.selectedText]}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    position: "relative",
  },
  bottomcontainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 12,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "50@s",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: "5@s",
  },
  tabBarItem: {
    alignItems: "center",
    padding: "10@s",
  },
  tabBarLabel: {
    fontSize: "10@s",
    fontWeight: "500",
    color: "#000",
    marginTop: "2@s",
  },
  selectedText: {
    color: "#FCA511",
  },
});

export default CustomTabBar;
