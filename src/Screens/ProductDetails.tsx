import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProductDetails = () => {
  const files = [
    {
      name: "Img1234567.png",
      copies: 1,
      pageCount: 1,
      instructions: "hello",
    },
    {
      name: "Document1234567.pdf",
      copies: 1,
      pageCount: 9,
      instructions: "hello",
      pages: "1,2,3,5-10",
    },
  ];

  const addons = [
    { label: "Spiral Binding", cost: 25, color: "#FFD966" },
    { label: "Lamination", cost: 25, color: "#FF9999" },
    { label: "Corner Staple", cost: 0, color: "#FF6666" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Product Name */}
        <Text style={styles.productName}>Product Name</Text>

        {/* Files Section */}
        {files.map((file, index) => (
          <View key={index} style={styles.fileCard}>
            <Text style={styles.fileText}>File : {file.name}</Text>
            <Text>Number of copies : {file.copies}</Text>
            {file.pages && <Text>Page number : {file.pages}</Text>}
            <Text>Page count : {file.pageCount}</Text>
            <Text>Instructions - {file.instructions}</Text>

            <TouchableOpacity style={styles.downloadBtn}>
              <Icon name="file-download" size={22} color="#1976D2" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add-on Section */}
        <View style={styles.card}>
          <Text style={styles.addonTitle}>Add on:</Text>
          <View style={styles.addonRow}>
            {addons.map((addon, i) => (
              <View
                key={i}
                style={[styles.addonBox, { backgroundColor: addon.color }]}
              >
                <Text style={styles.addonLabel}>{addon.label}</Text>
                <Text style={styles.addonCost}>
                  Cost - $ {addon.cost.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 24,
  },

  productName: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 15,
  },

  fileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    position: "relative",
  },
  fileText: { fontWeight: "bold", marginBottom: 5 },
  downloadBtn: {
    position: "absolute",
    right: 15,
    top: 15,
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  addonTitle: { fontWeight: "bold", marginBottom: 10 },
  addonRow: { flexDirection: "row", justifyContent: "space-between" },
  addonBox: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addonLabel: { fontWeight: "bold", textAlign: "center" },
  addonCost: { fontSize: 12, marginTop: 5 },
});
