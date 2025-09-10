import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeNavigation } from "../constants/app-routes.constants";

// Import screens
import Storescreen from "../Screens/Storescreen";
import MarketingTools from "../Screens/MarketingTools";
import OnlineStore from "../Screens/OnlineStore";

const Stack = createNativeStackNavigator();

const StoreStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={HomeNavigation.STORE_SCREEN}
        component={Storescreen}
      />
      <Stack.Screen
        name={HomeNavigation.MARKETING_TOOLS}
        component={MarketingTools}
      />
    </Stack.Navigator>
  );
};

export default StoreStackNavigator;
