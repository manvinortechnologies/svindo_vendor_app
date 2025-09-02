import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Headerwithback from "./Headerwithback";
import { SafeAreaView } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const tabs = ["Wholesale", "Retail", "Requested"];

const buyersRequests = [
  {
    id: "1",
    productName: "Premium Smartphone",
    category: "Electronics",
    subCategory: "Mobile Phones",
    userId: "svindouser_12345",
    city: "Mumbai",
    description:
      "Looking for latest smartphone with good camera quality and long battery life. Must be in excellent condition.",
    budget: "25000",
    image: require("../assets/product/product4.png"),
  },
  {
    id: "2",
    productName: "Gaming Laptop",
    category: "Electronics",
    subCategory: "Computers",
    userId: "svindouser_67890",
    city: "Delhi",
    description:
      "Need a high-performance gaming laptop for professional work and gaming. Prefer RTX graphics card.",
    budget: "80000",
    image: require("../assets/product/product4.png"),
  },
  {
    id: "3",
    productName: "Designer Watch",
    category: "Fashion",
    subCategory: "Accessories",
    userId: "svindouser_11111",
    city: "Bangalore",
    description:
      "Looking for luxury watch for special occasions. Must be authentic and in perfect working condition.",
    budget: "15000",
    image: require("../assets/product/product4.png"),
  },
  {
    id: "4",
    productName: "Home Speaker System",
    category: "Electronics",
    subCategory: "Audio",
    userId: "svindouser_22222",
    city: "Chennai",
    description:
      "Want wireless speaker system for home entertainment. Should have good bass and clear sound quality.",
    budget: "12000",
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
      {/* Buyer Requests - Full Screen Paging */}
      <Carousel
        vertical={true}
        pagingEnabled={true}
        loop={false}
        width={width}
        height={Dimensions.get("window").height}
        data={buyersRequests}
        onProgressChange={() => {}}
        renderItem={({ item }) => (
          <View style={styles.fullScreenCard}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.fullScreenProductImage}
              />
              {selectedTab === "Requested" && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    // Handle delete functionality
                    console.log("Delete request:", item.id);
                  }}
                >
                  <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

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
    top: 15,
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
  fullScreenCard: {
    backgroundColor: "#FFFAF2",
    marginHorizontal: 12,
    // marginVertical: 6,
    borderRadius: 12,
    padding: 15,
    height: Dimensions.get("window").height - s(130), // Exact height for paging
    justifyContent: "space-between",
  },
  productImage: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 20,
    marginBottom: 8,
    resizeMode: "cover",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  fullScreenProductImage: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 20,
    resizeMode: "cover",
  },
  deleteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    backgroundColor: "#FFF3E1CC",
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
