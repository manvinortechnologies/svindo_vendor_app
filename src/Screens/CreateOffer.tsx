import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import Headerwithback from "./Headerwithback";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const CreateOffer = () => {
  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Upload Media Box */}
      <TouchableOpacity style={styles.uploadBox}>
        <Icon name="add" size={24} color="#727272" />
        <Text style={styles.uploadText}>Upload Media</Text>
        <Text style={styles.uploadNote}>
          For Photos keep the dimension ratio 1:1
        </Text>
      </TouchableOpacity>
      {/* Heading */}
      <Text style={styles.label}>Heading</Text>
      <TextInput placeholder="Enter here" style={styles.input} />

      {/* Select Product */}
      <Text style={styles.label}>
        Select Product to connect (Optional - for retail only)
      </Text>
      <TextInput placeholder="Select product" style={styles.input} />

      {/* Selling Price */}
      <Text style={styles.label}>Selling Price</Text>
      <TextInput
        placeholder="Enter Amount"
        style={styles.input}
        keyboardType="numeric"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Enter details"
        style={styles.textArea}
        multiline
        numberOfLines={4}
      />
      {/* Note */}
      <Text style={styles.note}>
        Note:{"\n"}Use short description and lowest sales price to increase your
        chances of sales.{"\n"}Offer will be valid for 7 days.
      </Text>

      {/* Submit Offer Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Offer</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title={"Create Offer"} />
      <FlatList
        data={["form"]}
        keyExtractor={(item) => item}
        renderItem={renderForm}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default CreateOffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingVertical: 20
  },
  listContainer: {
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  uploadText: {
    color: "#727272",
    fontWeight: "600",
    marginTop: 4,
  },
  uploadNote: {
    color: "#727272",
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  label: {
    color: "#727272",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#FFF3E1",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#FFF3E1",
  },
  note: {
    fontSize: 12,
    color: "#727272",
    fontWeight: "600",
    marginBottom: 20,
  },
  submitButton: {
    width: "40%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
