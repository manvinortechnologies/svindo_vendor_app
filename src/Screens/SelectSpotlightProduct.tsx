import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import Headerwithback from "./Headerwithback";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 24;

const products = [
  {
    id: "1",
    name: "White T shirt",
    description: "White cotton logo print",
    image: require("../assets/product/spotlight.png"),
    stock: "5 Pieces Left",
  },
  {
    id: "2",
    name: "White T shirt",
    description: "White cotton logo print",
    image: require("../assets/product/spotlight.png"),
    stock: "5 Pieces Left",
  },
  {
    id: "3",
    name: "White T shirt",
    description: "White cotton logo print",
    image: require("../assets/product/spotlight.png"),
    stock: "5 Pieces Left",
  },
  {
    id: "4",
    name: "White T shirt",
    description: "White cotton logo print",
    image: require("../assets/product/spotlight.png"),
    stock: "5 Pieces Left",
  },
  {
    id: "5",
    name: "White T shirt",
    description: "White cotton logo print",
    image: require("../assets/product/spotlight.png"),
    stock: "5 Pieces Left",
  },
  {
    id: "6",
    name: "White T shirt",
    description: "White cotton logo print",
    image: require("../assets/product/spotlight.png"),
    stock: "5 Pieces Left",
  },
];

const SelectSpotlightProduct = () => {
  const renderItem = ({ item }: { item: (typeof products)[0] }) => (
    <View style={styles.card}>
      <View style={styles.stockBadge}>
        <Text style={styles.stockText}>{item.stock}</Text>
      </View>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title="Add Spotlight Product" />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default SelectSpotlightProduct;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  card: {
    width: cardWidth,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    margin: 6,
    overflow: "hidden",
  },
  stockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FCA311",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  stockText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  textContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
  },
  description: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },
  addButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FCA311",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
