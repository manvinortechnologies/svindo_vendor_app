import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import Headerwithback from './Headerwithback';
import Bottomnavigation from './Bottomnavigation';


const CompanyProfile = () => {
  return (
    <View style={styles.container}>
    <Headerwithback title="Company Profile" />
   
    <ScrollView contentContainerStyle={styles.formcontainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>T</Text>
      </View>

      <Text style={styles.title}>Update profile picture</Text>

      <TextInput style={styles.input} placeholder="Your Business name" />
      <TextInput style={styles.input} placeholder="GSTIN" />
      <TextInput style={styles.input} placeholder="Tarunkumar@gmail.com" />
      <TextInput style={styles.input} placeholder="987654321" />
      <TextInput style={styles.input} placeholder="Your brand name" />

      <Text style={styles.sectionLabel}>Add Billing Address</Text>
      <TextInput style={styles.textArea} multiline placeholder="" />

      <Text style={styles.sectionLabel}>Add Shipping Address</Text>
      <TextInput style={styles.textArea} multiline placeholder="" />

      <View style={styles.optionalRow}>
        <Text style={styles.optionalText}>Optional Fields</Text>
        <Text style={styles.customFields}>● Custom fields</Text>
      </View>

      <View style={styles.row}>
        <TextInput style={styles.smallInput} placeholder="PAN" />
        <TextInput style={styles.smallInput} placeholder="Website" />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save & Update</Text>
      </TouchableOpacity>
    </ScrollView>
    <Bottomnavigation />
    </View>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
    paddingVertical: 25
  },
  formcontainer:{
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: '#FFF1DC',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    color: '#FCA311',
    fontWeight: 'bold',
  },
  title: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  sectionLabel: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  textArea: {
    height: 60,
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#FFF1DC',
    marginBottom: 10,
  },
  optionalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  optionalText: {
    fontWeight: 'bold',
  },
  customFields: {
    fontSize: 12,
    color: '#FCA311',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  smallInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#FFF1DC',
  },
  button: {
    backgroundColor: '#FCA311',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
   marginVertical: 10,
   marginBottom: 30
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
