import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./Header";
import { StatusBar } from "react-native";
import Bottomnavigation from "./Bottomnavigation";
import NavigationButton from "./NavigationButton";
import { SafeAreaView } from "react-native-safe-area-context";

const products = [
  {
    id: "1",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
  {
    id: "2",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
  {
    id: "3",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
  {
    id: "4",
    name: "White T Shirt",
    stock: 5,
    description: "White cotton logo print",
    image: require("../assets/product.png"),
    price: 10,
  },
];

const orderTypes = ["Product/Service", " | ", "Add Ons"];
const StockScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedType, setSelectedType] = useState("Product/Service");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const updateQuantity = (id: string, amount: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + amount),
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Stock"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
      />
      <ScrollView style={styles.midcontent}>
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
        <View style={styles.filterContainer}>
          <View style={styles.filterButtons}>
            {["All", "Online", "Offline"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.selectedFilter,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.selectedFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.filterDropdown}>
            <Text style={styles.filterText}>Filters ▼</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.stockBadgeAbove}>
                <Text style={styles.stockText}>{item.stock} Pieces Left</Text>
              </View>
              <Image source={item.image} style={styles.productImage} />

              <View style={styles.bottomRow}>
                <View style={styles.productdetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDesc}>{item.description}</Text>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.quantityButton}
                  >
                    <Text style={[styles.quantityButtonText, { color: "red" }]}>
                      ➖
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {quantities[item.id] || 0}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={[styles.quantityButtonText, { color: "red" }]}>
                      ➕
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <View style={styles.floatingButtons}>
        <TouchableOpacity style={styles.addButtonGreen}>
          <Text style={styles.buttongreen}>
            {" "}
            <NavigationButton
              screen={
                selectedType === "Product/Service"
                  ? "CreateProduct"
                  : "AddAddOns"
              }
              label={
                selectedType === "Product/Service"
                  ? "Add Product"
                  : "Add Add Ons"
              }
              color="#00630F"
              fontSize={16}
              fontWeight="bold"
            />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ButtonContainer}>
        <View style={styles.typeButtonWrapper}>
          {orderTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && styles.selectedType,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === type && styles.selectedTypeText,
                ]}
              >
                {type}{" "}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Bottomnavigation />
    </SafeAreaView>
  );
};

export default StockScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 10,
  },
  floatingButtons: {
    position: "absolute",
    bottom: "25%",
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
  buttongreen: { color: "#00630F", marginLeft: 5, fontWeight: "bold" },
  addButtonBlue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F3FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#006EB2",
  },
  buttonblue: { color: "#006EB2", marginLeft: 5, fontWeight: "bold" },
  midcontent: {
    padding: 10,
  },
  searchBarContainer: {
    marginBottom: 10,
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
  micIcon: {
    width: 18,
    height: 18,
    tintColor: "red",
    marginLeft: 5,
  },
  productdetails: {
    maxWidth: "60%",
  },
  productList: {
    paddingBottom: 80,
  },
  productCard: {
    width: "47%",
    backgroundColor: "#fff",
    margin: "1.5%",
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    position: "relative",
  },
  stockBadgeAbove: {
    alignSelf: "flex-start",

    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: -20,
    zIndex: 1,
  },
  stockText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "#000",
  },
  productDesc: {
    fontSize: 12,
    color: "#777",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 2,
    borderRadius: 5,
    borderColor: "#FCA511",
  },
  quantityButton: {
    padding: 4,
    backgroundColor: "#FFF7DD",
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 6,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  ButtonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },

  typeButtonWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 40,
    elevation: 2,
    borderColor: "#C3C3C3",
    borderWidth: 1,
  },

  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },

  selectedType: {
    backgroundColor: "#fff",
  },

  typeText: {
    color: "#333",
    fontWeight: "bold",
  },

  selectedTypeText: {
    color: "#ffb347",
  },
  filterButtons: {
    flexDirection: "row",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#BEBEBE",
  },
  selectedFilter: {
    backgroundColor: "#FFA500",
    borderColor: "#fff",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  selectedFilterText: {
    color: "#fff",
  },
  filterDropdown: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BEBEBE",
  },
});
