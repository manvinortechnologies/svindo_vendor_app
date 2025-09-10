import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { s, ScaledSheet } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { HomeNavigation } from "../constants/app-routes.constants";

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [showStoreOptions, setShowStoreOptions] = useState(false);
  const currentRoute = state.routes[state.index];

  const handleStorePress = () => {
    if (currentRoute.name === HomeNavigation.STORE_SCREEN) {
      setShowStoreOptions(!showStoreOptions);
    } else {
      navigation.navigate(HomeNavigation.STORE_SCREEN);
    }
  };

  return (
    <View style={styles.container}>
      {/* Store Options Overlay */}
      {currentRoute.name === HomeNavigation.STORE_SCREEN && (
        <View style={styles.bottomcontainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              navigation.navigate({
                name: HomeNavigation.STORE_SCREEN,
                params: { screen: HomeNavigation.STORE_SCREEN },
              });
              setShowStoreOptions(false);
            }}
          >
            <Icon
              name="storefront"
              size={20}
              color={
                currentRoute.name === HomeNavigation.STORE_SCREEN
                  ? "#FCA511"
                  : "#555"
              }
            />
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    currentRoute.name === HomeNavigation.STORE_SCREEN
                      ? "#FCA511"
                      : "#000",
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
              setShowStoreOptions(false);
            }}
          >
            <Icons
              name="setting"
              size={20}
              color={
                currentRoute.name !== HomeNavigation.STORE_SCREEN
                  ? "#FCA511"
                  : "#555"
              }
            />
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    currentRoute.name !== HomeNavigation.STORE_SCREEN
                      ? "#FCA511"
                      : "#000",
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
              if (route.name === HomeNavigation.STORE_SCREEN) {
                handleStorePress();
              } else {
                navigation.navigate(route.name);
              }
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
                    name="appstore-o"
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.ORDERS:
                return (
                  <MaterialIcons
                    name="shopping-bag"
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.STOCK_SCREEN:
                return (
                  <Icon
                    name="chart-box"
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.STORE_SCREEN:
                return (
                  <Icon
                    name="storefront-outline"
                    size={s(20)}
                    color={isFocused ? "#FCA511" : "#000"}
                  />
                );
              case HomeNavigation.ERP:
                return (
                  <Icon
                    name="menu"
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
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
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
