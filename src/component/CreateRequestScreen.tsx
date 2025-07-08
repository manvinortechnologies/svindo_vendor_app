import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Headerwithback from "./Headerwithback";

const CreateRequestScreen = () => {
  const [selectedType, setSelectedType] = useState<
    "Business" | "Personal"
  >("Business");

  return (
    <View style={styles.container}>
      <Headerwithback title={"Create Request"} />

      <ScrollView contentContainerStyle={styles.listContainer}>
        <View style={styles.formContainer}>
          <Text
            style={{
              color: "#727272",
              marginBottom: 20,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Create a product request and get multiple offers from both regional
            and national businesses. Happy Shopping !
          </Text>

          <View style={styles.typeRow}>
            <Text
              style={{
                color: "#727272",
                fontWeight: "600",
                fontSize: 16,
                marginTop: 5,
                marginRight: 10,
              }}
            >
              Type
            </Text>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "Business" && styles.typeButtonSelected,
              ]}
              onPress={() => setSelectedType("Business")}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === "Business" && styles.typeTextSelected,
                ]}
              >
                For Business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "Personal" && styles.typeButtonSelected,
              ]}
              onPress={() => setSelectedType("Personal")}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === "Personal" && styles.typeTextSelected,
                ]}
              >
                Personal use
              </Text>
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            placeholder="Ex: Bulk military dress for school function"
            style={styles.input}
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <TextInput placeholder="select" style={styles.input} />

          {/* Sub-Category */}
          <Text style={styles.label}>Sub-Category</Text>
          <TextInput placeholder="select" style={styles.input} />

          {/* Budget */}
          <Text style={styles.label}>Budget</Text>
          <TextInput
            placeholder="Enter amount"
            style={styles.input}
            keyboardType="numeric"
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Enter full detail"
            style={styles.textArea}
            multiline
            numberOfLines={4}
          />

          {/* Upload Photos */}
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload Photos</Text>
          </TouchableOpacity>

          {/* Note */}
          <Text style={styles.note}>
            Note: Your contact details will remain private.
            {"\n"}Responses to your request will appear in the Spotlight
            section, where you can browse, like, chat, or shop — all without
            spam.
          </Text>

          {/* Submit Request */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateRequestScreen;


const styles = StyleSheet.create({
    container: {
    padding: 10, 
    backgroundColor: '#fff',
    paddingBottom: 20
    },
    listContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FCA311',
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  typeButtonSelected: {
    backgroundColor: '#FCA311',
  },
  typeText: {
    textAlign: 'center',
    color: '#FCA311',
    fontWeight: '500',
  },
  typeTextSelected: {
    color: '#fff',
  },
  label: {
    color: '#727272',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2
  },
  input: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#FFF3E1'
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#FFF3E1'
  },
  uploadButton: {
    width: '30%',
    height: 100,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
  },
  uploadText: {
    color: '#FCA311',
    fontWeight: '500',
    textAlign: 'center'
  },
  note: {
    fontSize: 12,
    color: '#727272',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    width: '40%',
    alignSelf: 'center',
    backgroundColor: '#FCA311',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 40
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
})