import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import Headerwithback from "./Headerwithback";
import Bottomnavigation from "./Bottomnavigation";

import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const templates = [
  require("../assets/tamplate.png"),
  require("../assets/tamplate1.png"),
  require("../assets/tamplate.png"),
  require("../assets/tamplate.png"),
  require("../assets/tamplate1.png"),
  require("../assets/tamplate.png"),
  require("../assets/tamplate.png"),
  require("../assets/tamplate1.png"),
  require("../assets/tamplate.png"),
];

const invoiceTypes = ["Invoice", "Purchase", "Estimate"];

const InvoiceTemplates = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState("Invoice");
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Headerwithback title="Invoice Tamplates" />

      <ScrollView>
        {/* Invoice Type Switch */}
        <View style={styles.typeSwitchContainer}>
          {invoiceTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={[
                styles.typeButton,
                selectedType === type && styles.typeButtonSelected,
              ]}
            >
              <Text
                style={
                  selectedType === type
                    ? styles.typeTextSelected
                    : styles.typeText
                }
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Image */}
        <View style={styles.previewContainer}>
          <Image
            source={templates[selectedTemplate]}
            style={styles.previewImage}
          />
        </View>

        {/* Template Thumbnails */}
        <Text style={styles.sectionTitle}>Choice Invoice Template</Text>
        <FlatList
          data={templates}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.thumbnailList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedTemplate(index)}
              style={styles.thumbnailWrapper}
            >
              <Image
                source={item}
                style={[
                  styles.thumbnail,
                  selectedTemplate === index && styles.thumbnailSelected,
                ]}
              />
            </TouchableOpacity>
          )}
        />

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          {templates.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                selectedTemplate === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.updateBtn}>
          <Text style={styles.updateText}>Save and Update</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      <Bottomnavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  typeSwitchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  typeButtonSelected: {
    backgroundColor: "#FB923C",
    borderColor: "transparent",
  },
  typeText: {
    color: "#374151",
  },
  typeTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  previewContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  previewImage: {
    width: "90%",
    height: 400,
    resizeMode: "contain",
    borderRadius: 12,
    maxWidth: "90%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    paddingHorizontal: 16,
  },
  thumbnailList: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  thumbnailWrapper: {
    marginRight: 16,
  },
  thumbnail: {
    height: 128,
    width: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  thumbnailSelected: {
    borderColor: "#FB923C",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#D1D5DB",
  },
  paginationDotActive: {
    backgroundColor: "#000",
  },
  updateBtn: {
    backgroundColor: "#FCA311",
    marginTop: 40,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    width: "50%",
    alignSelf: "center",
    marginBottom: 10,
  },
  updateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default InvoiceTemplates;
