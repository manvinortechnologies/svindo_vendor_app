import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Headerwithback from './Headerwithback'
import CustomSwitch from './CustomSwitch';

const AddVendor = () => {
    const [sameAsBilling, setSameAsBilling] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <Headerwithback title={'Add Vendor'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Basic Details */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Details</Text>
            <View style={styles.sectionContent}>
                {["Vendor Name", "Mobille Number", "Email Id"].map((label, index) => (
                <View key={index} style={styles.inputWrapper}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput placeholder={`Enter ${label}`}
                    placeholderTextColor="#999"
                    style={styles.input}
                    />
                </View>
            ))}
            </View>
        </View>

        {/* Business Details */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Details</Text>
            <View style={styles.sectionContent}>
                {["Customer Name", "GST", "Aadhar Number", "Pan"].map((label, index) => (
                <View key={index} style={styles.inputWrapper}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput placeholder={`Enter ${label}`}
                    placeholderTextColor="#999"
                    style={styles.input}
                    />
                </View>    
            ))}
            </View>
        </View>
        {/* Billing Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.sectionContent}>
            {[
            'Address Line 1',
            'Address Line 2',
            'Pincode',
            'City',
            'State',
            'Country',
          ].map((placeholder, idx) => (
            <TextInput
              key={idx}
              placeholder={placeholder}
              placeholderTextColor="#888"
              style={[styles.input, {marginBottom: 10}]}
            />
          ))}
          </View>
        </View>

        {/* Dispatch Address Section */}
        {/* <View style={styles.section}>
          <View style={styles.dispatchHeader}>
            <Text style={styles.sectionTitle}>Dispatch Address</Text>
            <View style={styles.sameAsRow}>
              <Text style={styles.sameAsText}>Same as Billing</Text>
              <CustomSwitch
                value={sameAsBilling}
                onValueChange={setSameAsBilling}
              />
            </View>
          </View>
          <View style={styles.sectionContent}>
            {[
            'Address Line 1',
            'Address Line 2',
            'Pincode',
            'City',
            'State',
            'Country',
          ].map((placeholder, idx) => (
            <TextInput
              key={idx}
              placeholder={placeholder}
              placeholderTextColor="#888"
              style={[styles.input, {marginBottom: 10}]}
              editable={!sameAsBilling}
            />
          ))}
          </View>
        </View> */}

        {/* Transport Name */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transport Name</Text>
          <TextInput
            placeholder="Transport Name"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View> */}
        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddVendor

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FCA311",
    marginBottom: 10
  },
  sectionContent: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 5,
    color: "#000"
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFF8EB",
    fontSize: 14
  },
  dispatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sameAsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sameAsText: {
    marginRight: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  saveButton: {
    width: '40%',
    alignSelf: 'center',
    backgroundColor: "#FCA311",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
    elevation: 3
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15
  }
})