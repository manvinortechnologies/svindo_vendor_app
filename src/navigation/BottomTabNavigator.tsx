import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeNavigation } from "../constants/app-routes.constants";
import StoreStackNavigator from "./StoreStackNavigator";
import CustomTabBar from "./CustomTabBar";

// Import screens
import StatisticsScreen from "../Screens/StatisticsScreen";
import Orders from "../Screens/Orders";
import StockScreen from "../Screens/StockScreen";
import Erp from "../Screens/Erp";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name={HomeNavigation.STATISTICS_SCREEN}
        component={StatisticsScreen}
        options={{
          tabBarLabel: "Dashboard",
        }}
      />
      <Tab.Screen
        name={HomeNavigation.ORDERS}
        component={Orders}
        options={{
          tabBarLabel: "Order",
        }}
      />
      <Tab.Screen
        name={HomeNavigation.STOCK_SCREEN}
        component={StockScreen}
        options={{
          tabBarLabel: "Stock",
        }}
      />
      <Tab.Screen
        name={HomeNavigation.STORE_SCREEN}
        component={StoreStackNavigator}
        options={{
          tabBarLabel: "Store",
        }}
      />
      <Tab.Screen
        name={HomeNavigation.ERP}
        component={Erp}
        options={{
          tabBarLabel: "ERP",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
