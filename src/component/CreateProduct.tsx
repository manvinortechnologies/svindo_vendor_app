import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import Bottomnavigation from "./Bottomnavigation";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const products = [
  { id: "1", title: "White T shirt", subtitle: "White cotton logo print", image: require("../assets/product.png") },
  { id: "2", title: "White T shirt", subtitle: "White cotton logo print", image: require("../assets/product.png") },
  { id: "3", title: "White T shirt", subtitle: "White cotton logo print", image: require("../assets/product.png") },
  { id: "4", title: "White T shirt", subtitle: "White cotton logo print", image: require("../assets/product.png") },
  { id: "5", title: "White T shirt", subtitle: "White cotton logo print", image: require("../assets/product.png") },
  { id: "6", title: "White T shirt", subtitle: "White cotton logo print", image: require("../assets/product.png") },
];

const numColumns = 2;
const itemWidth = (Dimensions.get("window").width - 40) / numColumns;

const CreateProduct = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: typeof products[0] }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productSubtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Image source={require("../assets/search.png")} style={styles.searchIcon} />
          <TextInput placeholder="Searched Product/Service" placeholderTextColor="#000" style={styles.searchInput} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.noteSection}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteText}>
            If the product you want to add to catalog is not available, Please create a new product.
          </Text>
        </View>

        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("AddProductScreen" as never)}
      >
        <Text style={styles.createButtonText}>Create New</Text>
      </TouchableOpacity>

      <Bottomnavigation />
    </View>
  );
};

export default CreateProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  header: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEFD4",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 25,
    height: 40,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#000",
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 14,
  },
  noteSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  noteLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  noteText: {
    fontSize: 14,
    color: "#000",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    width: itemWidth,
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 8,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  productSubtitle: {
    fontSize: 12,
    color: "#555",
  },
  createButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#FCA311",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
