import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from 'react';
import { useNavigation, useRoute } from "@react-navigation/native"; 
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Orders: undefined;
  StockScreen: undefined;
  Erp: undefined;
  StatisticsScreen: undefined;
  Storescreen : undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "StockScreen">;

const Bottomnavigation = () => {
  const navigation = useNavigation<NavigationProp>(); 
  const route = useRoute(); 

  return (
    <View>
      <View style={styles.bottomNavbar}>
        <TouchableOpacity 
          style={styles.bottombar} 
          activeOpacity={0.6} 
          onPress={() => navigation.navigate("StatisticsScreen")}
        >
          <Icons 
            name="appstore-o" 
            size={28} 
            color={route.name === "StatisticsScreen" ? "#FCA511" : "#000"} 
          />
          <Text style={[styles.bottombartext, route.name === "StatisticsScreen" && styles.selectedText]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottombar} 
          activeOpacity={0.6} 
          onPress={() => navigation.navigate("Orders")}
        >
          <MaterialIcons 
            name="shopping-bag" 
            size={28} 
            color={route.name === "Orders" ? "#FCA511" : "#000"} 
          />
          <Text style={[styles.bottombartext, route.name === "Orders" && styles.selectedText]}>
            Order
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottombar} 
          activeOpacity={0.6} 
          onPress={() => navigation.navigate("StockScreen")}
        >
          <Icon 
            name="chart-box" 
            size={28} 
            color={route.name === "StockScreen" ? "#FCA511" : "#000"} 
          />
          <Text style={[styles.bottombartext, route.name === "StockScreen" && styles.selectedText]}>
            Stock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottombar} 
          activeOpacity={0.6} 
          onPress={() => navigation.navigate("Storescreen")}
        >
          <Icon 
            name="storefront-outline" 
            size={28} 
            color={route.name === "Storescreen" ? "#FCA511" : "#000"} 
          />
          <Text style={[styles.bottombartext, route.name === "Storescreen" && styles.selectedText]}>
            Store
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottombar} activeOpacity={0.6} 
          onPress={() => navigation.navigate("Erp")}>
          <Icon name="menu" size={28}  color={route.name === "Erp" ? "#FCA511" : "#000"} />
          <Text style={[styles.bottombartext, route.name === "Erp" && styles.selectedText]}>ERP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingBottom:12
    
    ,
  },
  bottombartext: {
    fontSize: 12,
    color: "#000",
  },
  bottombar: {
    alignItems: "center",
    padding: 10, // Helps make touchable area bigger
  },
  selectedText: {
    color: "#FCA511",
    fontWeight: "bold",
  },
});

export default Bottomnavigation;
