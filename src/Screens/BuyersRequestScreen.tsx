import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Headerwithback from "./Headerwithback";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const tabs = ["Wholesale", "Retail", "Requested"];

const buyersRequests = [
  {
    id: "1",
    productName: "Product Name",
    category: "Category",
    subCategory: "Sub-Category",
    userId: "svindouser_12345",
    city: "city name",
    description: "Show full detail",
    budget: "1000",
    image: require("../assets/product/product4.png"),
  },
  {
    id: "2",
    productName: "Another Product",
    category: "Category",
    subCategory: "Sub-Category",
    userId: "svindouser_67890",
    city: "another city",
    description: "Show full detail",
    budget: "2000",
    image: require("../assets/product/product4.png"),
  },
];

type RootStackParamList = {
  BuyersRequest: undefined;
  CreateRequest: undefined;
  CreateOffer: undefined;
};

type BuyersRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateRequest"
>;

const BuyersRequestScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Wholesale");

  const navigation = useNavigation<BuyersRequestScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      {/* Reuse your Headerwithback */}
      <Headerwithback title="Buyers Request" />

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterTopButton}
        onPress={() => {
          console.log("Filter pressed");
        }}
      >
        <Text style={styles.filterTopText}>Filter</Text>
        <Icon name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabSelected]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextSelected,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Buyer Requests */}
      <FlatList
        data={buyersRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Product Image */}
            <Image source={item.image} style={styles.productImage} />

            {/* Customer wants to buy */}
            <View style={styles.rowBetween}>
              <Text style={styles.customerText}>
                {selectedTab === "Requested"
                  ? "You want to buy"
                  : "Customer wants to buy"}
              </Text>
              <TouchableOpacity style={styles.sellButton}>
                <Text style={styles.sellButtonText}>
                  {selectedTab === "Requested" ? "Show offers" : "Sell now"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Product Name */}
            <Text style={styles.productName}>{item.productName}</Text>

            {/* Details */}
            <View style={styles.detailsRow}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.label}>
                    Category {"\n"}
                    <Text style={styles.label}> {item.subCategory}</Text>
                  </Text>
                </View>
                <Text style={styles.budgetText}>Budget</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <Text style={styles.label}>User id</Text>
                <Text style={styles.subLabel}>{item.userId}</Text>
                {/* Hide Offer Coupon button in Requested */}
                {selectedTab !== "Requested" && (
                  <TouchableOpacity style={styles.couponButton}>
                    <Text style={styles.couponButtonText}>Offer Coupon</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.subLabel}>{item.city}</Text>
              <View>
                <Text style={[styles.label, { marginTop: 5 }]}>
                  Description
                </Text>
                <Text style={styles.subLabel}>{item.description}</Text>
              </View>
            </View>
          </View>
        )}
      />
      {/* Show Your Request & Offers for you button  */}
      {selectedTab === "Requested" && (
        <View style={styles.requestBox}>
          <TouchableOpacity
            style={styles.requestTabButton}
            onPress={() => navigation.navigate("CreateRequest")}
          >
            <Text style={styles.requestTabText}>Your Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.requestTabButton}
            onPress={() => navigation.navigate("CreateOffer")}
          >
            <Text style={styles.requestTabText}>Offers for you</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Request Stock */}
      <View style={styles.requestStockContainer}>
        <Text style={styles.swipeText}>
          <Icon name="arrow-up" size={24} color="#FFE8C1" /> Swipe up to see
          more
        </Text>
        <TouchableOpacity
          style={styles.requestStockButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.requestStockText}>Request Stock</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BuyersRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterTopButton: {
    position: "absolute",
    right: 10,
    top: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F59E0B",
    borderRadius: 6,
    marginLeft: "auto", // push to right
  },
  filterTopText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
    marginRight: 2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterText: {
    fontSize: 13,
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFF5E5",
  },
  tabSelected: {
    backgroundColor: "#F59E0B",
  },
  tabText: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "600",
  },
  tabTextSelected: {
    color: "#FFF",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFAF2",
    margin: 12,
    borderRadius: 8,
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 20,
    marginBottom: 8,
    resizeMode: "cover",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  customerText: {
    color: "#F59E0B",
    fontSize: 20,
    fontWeight: "600",
  },
  sellButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  sellButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginVertical: 8,
  },
  detailsRow: {
    marginTop: 6,
  },
  detailsLeft: {
    flex: 1,
    gap: 5,
  },
  label: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  subLabel: {
    fontWeight: "500",
    color: "#727272",
  },
  detailsRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  budgetText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  couponButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  couponButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  requestStockContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 10,
  },
  swipeText: {
    fontSize: 14,
    color: "#727272",
    marginBottom: 4,
  },
  requestBox: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF3E1",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F59E0B",
    zIndex: 5,
  },
  requestTabButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  requestTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  requestStockButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  requestStockText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "800",
  },
});
