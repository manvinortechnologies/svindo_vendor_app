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

const CreateProduct = () => {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Image
            source={require("../assets/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#006EB2"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Image
              source={require("../assets/mic.png")}
              style={styles.micIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.drafttext}>
          <Icon name="tooltip-image" color={"#000"} size={24} />
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
          screen="AddProductScreen"
          label="Create New"
          color="#000"
          fontSize={16}
          fontWeight="bold"
          buttonStyle={styles.addButtonGreen}
          textStyle={styles.buttongreen}
        />
      </View>

      <Bottomnavigation></Bottomnavigation>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#FFF",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
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
  drafttext: {
    fontSize: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    borderBottomWidth: 2,
    borderColor: "#ECECEC",
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006EB21C",
    paddingHorizontal: 10,
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 10,
    height: 40,
    width: "80%",
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#006EB2",
    marginRight: 5,
  },

  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 14,
  },

  micIcon: {
    width: 18,
    height: 18,
    tintColor: "red",
    marginLeft: 5,
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

export default CreateProduct;
