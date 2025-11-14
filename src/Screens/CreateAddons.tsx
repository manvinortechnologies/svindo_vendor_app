import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavigationButton from "./NavigationButton";
import Bottomnavigation from "./Bottomnavigation";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeNavigation } from "../constants/app-routes.constants";

const CreateAddons = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button and Search Bar */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Image
            source={require("../assets/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Searched Product/Service"
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView>
        <View style={styles.addsection}>
          <Text style={styles.label}>Note: </Text>
          <Text style={styles.sublabel}>
            if the product you want to add to catelog is not available , Please
            create a new product.{" "}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.floatingButtons}>
        <NavigationButton
          screen={HomeNavigation.ADD_ADDONS}
          label="Create New"
          color="#000"
          fontSize={16}
          fontWeight="bold"
          buttonStyle={styles.addButtonGreen}
          textStyle={styles.buttongreen}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#FFF",
    flex: 1,
  },
  floatingButtons: {
    position: "absolute",
    top: "90%",
    right: 20,
    flexDirection: "column",
    gap: 10,
  },
  addButtonGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D7FFE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00630F",
  },
  buttongreen: { color: "#00630F", fontWeight: "bold" },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#FF9800",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7DD",
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 45,
    borderWidth: 1,
    borderColor: "#FFB74D",
  },

  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#000",
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    fontWeight: "400",
  },
  addsection: {
    flexDirection: "row",
  },
  sublabel: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateAddons;
